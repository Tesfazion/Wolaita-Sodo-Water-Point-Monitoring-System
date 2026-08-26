-- Wolaita Sodo Water-Point Monitoring System Database Schema
-- Community Water-Point Monitoring System
-- Location: Wolaita Zone, South Ethiopia

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- =====================================================
-- JURISDICTIONS TABLE
-- Stores administrative boundaries (Woredas in Wolaita Zone)
-- =====================================================
CREATE TABLE jurisdictions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'woreda', -- woreda, zone, region
    parent_id INTEGER REFERENCES jurisdictions(id),
    center_point GEOMETRY(Point, 4326), -- Geographic center
    boundary GEOMETRY(Polygon, 4326), -- Optional boundary polygon
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for spatial queries
CREATE INDEX idx_jurisdictions_center ON jurisdictions USING GIST(center_point);
CREATE INDEX idx_jurisdictions_boundary ON jurisdictions USING GIST(boundary);

-- =====================================================
-- OFFICES TABLE
-- WASH offices responsible for maintenance
-- =====================================================
CREATE TABLE offices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'woreda_office', -- woreda_office, ngo, zone_office
    jurisdiction_id INTEGER REFERENCES jurisdictions(id),
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- USERS TABLE
-- System users (admin, office staff, technicians)
-- =====================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- admin, office_user, technician, citizen
    office_id INTEGER REFERENCES offices(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =====================================================
-- WATER_POINTS TABLE
-- Registry of all water infrastructure
-- =====================================================
CREATE TABLE water_points (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- hand_pump, shallow_well, borehole, protected_spring
    location GEOMETRY(Point, 4326) NOT NULL,
    address TEXT,
    jurisdiction_id INTEGER REFERENCES jurisdictions(id),
    office_id INTEGER REFERENCES offices(id),
    installation_date DATE,
    current_status VARCHAR(50) DEFAULT 'working', -- working, reported_broken, under_repair, resolved
    last_maintenance_date DATE,
    population_served INTEGER,
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for location queries
CREATE INDEX idx_water_points_location ON water_points USING GIST(location);
CREATE INDEX idx_water_points_status ON water_points(current_status);
CREATE INDEX idx_water_points_jurisdiction ON water_points(jurisdiction_id);

-- =====================================================
-- REPORTS TABLE
-- Citizen-submitted fault reports
-- =====================================================
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    water_point_id INTEGER NOT NULL REFERENCES water_points(id),
    reporter_name VARCHAR(100),
    reporter_phone VARCHAR(20),
    reporter_email VARCHAR(100),
    fault_type VARCHAR(100) NOT NULL, -- no_water, contaminated, pump_broken, leaking, other
    description TEXT,
    photo_url TEXT,
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    status VARCHAR(50) DEFAULT 'reported', -- reported, acknowledged, in_progress, resolved, closed
    office_id INTEGER REFERENCES offices(id),
    assigned_technician_id INTEGER REFERENCES users(id),
    resolution_notes TEXT,
    resolved_photo_url TEXT,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP,
    started_at TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_water_point ON reports(water_point_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_office ON reports(office_id);
CREATE INDEX idx_reports_reported_at ON reports(reported_at);

-- =====================================================
-- STATUS_HISTORY TABLE
-- Audit trail for report status changes
-- =====================================================
CREATE TABLE status_history (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by_user_id INTEGER REFERENCES users(id),
    notes TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status_history_report ON status_history(report_id);

-- =====================================================
-- REPORT_CONFIRMATIONS TABLE
-- "Me too" confirmations from other community members
-- =====================================================
CREATE TABLE report_confirmations (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    confirmer_name VARCHAR(100),
    confirmer_phone VARCHAR(20),
    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_confirmations_report ON report_confirmations(report_id);

-- =====================================================
-- MAINTENANCE_LOGS TABLE
-- Scheduled and completed maintenance activities
-- =====================================================
CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    water_point_id INTEGER NOT NULL REFERENCES water_points(id),
    technician_id INTEGER REFERENCES users(id),
    maintenance_type VARCHAR(100) NOT NULL, -- routine, repair, inspection
    description TEXT,
    parts_replaced TEXT,
    cost DECIMAL(10,2),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_water_point ON maintenance_logs(water_point_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- =====================================================
-- AUTOMATIC STATUS HISTORY LOGGING
-- =====================================================
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO status_history (report_id, old_status, new_status, changed_at)
        VALUES (NEW.id, OLD.status, NEW.status, CURRENT_TIMESTAMP);
        
        -- Update water point status
        UPDATE water_points 
        SET current_status = CASE 
            WHEN NEW.status = 'reported' THEN 'reported_broken'
            WHEN NEW.status = 'in_progress' THEN 'under_repair'
            WHEN NEW.status = 'resolved' THEN 'working'
            ELSE current_status
        END
        WHERE id = NEW.water_point_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER report_status_change AFTER UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION log_status_change();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to find nearest office to a water point
CREATE OR REPLACE FUNCTION get_nearest_office(point_location GEOMETRY)
RETURNS INTEGER AS $$
DECLARE
    nearest_office_id INTEGER;
BEGIN
    SELECT o.id INTO nearest_office_id
    FROM offices o
    JOIN jurisdictions j ON o.jurisdiction_id = j.id
    WHERE o.is_active = true
    ORDER BY ST_Distance(j.center_point, point_location)
    LIMIT 1;
    
    RETURN nearest_office_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate time to resolution in hours
CREATE OR REPLACE FUNCTION calculate_resolution_time(report_id_param INTEGER)
RETURNS DECIMAL AS $$
DECLARE
    resolution_hours DECIMAL;
BEGIN
    SELECT EXTRACT(EPOCH FROM (resolved_at - reported_at)) / 3600 INTO resolution_hours
    FROM reports
    WHERE id = report_id_param AND resolved_at IS NOT NULL;
    
    RETURN COALESCE(resolution_hours, 0);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Active reports with water point details
CREATE VIEW active_reports_view AS
SELECT 
    r.id,
    r.status,
    r.fault_type,
    r.description,
    r.priority,
    r.reported_at,
    r.photo_url,
    wp.name AS water_point_name,
    wp.type AS water_point_type,
    wp.address,
    ST_Y(wp.location) AS latitude,
    ST_X(wp.location) AS longitude,
    o.name AS office_name,
    u.name AS technician_name,
    (SELECT COUNT(*) FROM report_confirmations WHERE report_id = r.id) AS confirmation_count
FROM reports r
JOIN water_points wp ON r.water_point_id = wp.id
LEFT JOIN offices o ON r.office_id = o.id
LEFT JOIN users u ON r.assigned_technician_id = u.id
WHERE r.status IN ('reported', 'acknowledged', 'in_progress')
ORDER BY r.reported_at DESC;

-- View: Water points with latest report status
CREATE VIEW water_points_summary AS
SELECT 
    wp.id,
    wp.name,
    wp.type,
    wp.current_status,
    ST_Y(wp.location) AS latitude,
    ST_X(wp.location) AS longitude,
    wp.address,
    wp.population_served,
    j.name AS jurisdiction_name,
    o.name AS office_name,
    COUNT(r.id) AS total_reports,
    MAX(r.reported_at) AS last_report_date
FROM water_points wp
LEFT JOIN jurisdictions j ON wp.jurisdiction_id = j.id
LEFT JOIN offices o ON wp.office_id = o.id
LEFT JOIN reports r ON wp.id = r.water_point_id
GROUP BY wp.id, j.name, o.name;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE water_points IS 'Registry of all water infrastructure in Wolaita Zone';
COMMENT ON TABLE reports IS 'Citizen-submitted fault reports for water points';
COMMENT ON TABLE offices IS 'WASH offices responsible for maintenance';
COMMENT ON TABLE jurisdictions IS 'Administrative boundaries (Woredas)';
COMMENT ON TABLE users IS 'System users including admin, office staff, and technicians';
COMMENT ON COLUMN water_points.location IS 'Geographic coordinates stored as PostGIS Point geometry';
COMMENT ON COLUMN reports.status IS 'Report lifecycle: reported -> acknowledged -> in_progress -> resolved';
