-- Simple Schema without PostGIS
-- Wolaita Sodo Water-Point Monitoring System Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS report_confirmations CASCADE;
DROP TABLE IF EXISTS status_history CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS water_points CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS offices CASCADE;
DROP TABLE IF EXISTS jurisdictions CASCADE;

-- Jurisdictions Table (Woredas in Wolaita Zone)
CREATE TABLE jurisdictions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    woreda_name VARCHAR(100) NOT NULL,
    zone_name VARCHAR(100) DEFAULT 'Wolaita',
    region_name VARCHAR(100) DEFAULT 'South Ethiopia',
    population INTEGER,
    center_lat DECIMAL(10, 8),
    center_lng DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WASH Offices Table
CREATE TABLE offices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    office_type VARCHAR(50) DEFAULT 'woreda',
    jurisdiction_id INTEGER REFERENCES jurisdictions(id),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (Admins, Technicians, etc.)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'technician',
    office_id INTEGER REFERENCES offices(id),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Water Points Table
CREATE TABLE water_points (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    jurisdiction_id INTEGER REFERENCES jurisdictions(id),
    office_id INTEGER REFERENCES offices(id),
    installation_date DATE,
    current_status VARCHAR(50) DEFAULT 'working',
    beneficiaries INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_water_points_status ON water_points(current_status);
CREATE INDEX idx_water_points_jurisdiction ON water_points(jurisdiction_id);
CREATE INDEX idx_water_points_location ON water_points(latitude, longitude);

-- Reports Table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    water_point_id INTEGER NOT NULL REFERENCES water_points(id),
    reporter_name VARCHAR(100),
    reporter_phone VARCHAR(20),
    reporter_email VARCHAR(100),
    fault_type VARCHAR(50) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(50) DEFAULT 'reported',
    photo_url TEXT,
    office_id INTEGER REFERENCES offices(id),
    assigned_technician_id INTEGER REFERENCES users(id),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_water_point ON reports(water_point_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_office ON reports(office_id);
CREATE INDEX idx_reports_reported_at ON reports(reported_at);

-- Status History Table
CREATE TABLE status_history (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by INTEGER REFERENCES users(id),
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status_history_report ON status_history(report_id);

-- Report Confirmations Table
CREATE TABLE report_confirmations (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    confirmer_name VARCHAR(100),
    confirmer_phone VARCHAR(20),
    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_confirmations_report ON report_confirmations(report_id);

-- Maintenance Logs Table
CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    water_point_id INTEGER NOT NULL REFERENCES water_points(id),
    maintenance_type VARCHAR(50) NOT NULL,
    technician_id INTEGER REFERENCES users(id),
    description TEXT,
    cost DECIMAL(10, 2),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_water_point ON maintenance_logs(water_point_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_jurisdictions_updated_at BEFORE UPDATE ON jurisdictions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offices_updated_at BEFORE UPDATE ON offices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_water_points_updated_at BEFORE UPDATE ON water_points
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO status_history (report_id, old_status, new_status, notes)
        VALUES (NEW.id, OLD.status, NEW.status, 'Status changed');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER report_status_change AFTER UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- Views for analytics
CREATE OR REPLACE VIEW report_details AS
SELECT 
    r.id,
    r.water_point_id,
    wp.name as water_point_name,
    wp.address as water_point_address,
    wp.latitude,
    wp.longitude,
    r.fault_type,
    r.description,
    r.priority,
    r.status,
    r.reporter_name,
    r.reporter_phone,
    r.photo_url,
    r.reported_at,
    r.resolved_at,
    EXTRACT(EPOCH FROM (COALESCE(r.resolved_at, CURRENT_TIMESTAMP) - r.reported_at))/3600 as hours_since_report,
    u.name as technician_name,
    u.phone as technician_phone,
    o.name as office_name,
    COUNT(rc.id) as confirmations
FROM reports r
LEFT JOIN water_points wp ON r.water_point_id = wp.id
LEFT JOIN users u ON r.assigned_technician_id = u.id
LEFT JOIN offices o ON r.office_id = o.id
LEFT JOIN report_confirmations rc ON r.id = rc.report_id
GROUP BY r.id, wp.id, u.id, o.id;

-- Comments
COMMENT ON TABLE jurisdictions IS 'Administrative boundaries (Woredas)';
COMMENT ON TABLE offices IS 'WASH office locations and contacts';
COMMENT ON TABLE users IS 'System users (admins, technicians)';
COMMENT ON TABLE water_points IS 'Water point registry';
COMMENT ON TABLE reports IS 'Water point fault reports';
