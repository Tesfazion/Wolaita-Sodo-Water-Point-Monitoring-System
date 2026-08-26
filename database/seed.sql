-- Wolaita Sodo Water-Point Monitoring System Sample Data
-- Wolaita Zone, South Ethiopia Region
-- This file populates the database with realistic sample data

-- =====================================================
-- JURISDICTIONS (Wolaita Zone Woredas)
-- =====================================================
-- Wolaita Zone center: approximately 6.85°N, 37.75°E (Sodo City area)

INSERT INTO jurisdictions (name, type, parent_id, center_point) VALUES
('Wolaita Zone', 'zone', NULL, ST_SetSRID(ST_MakePoint(37.75, 6.85), 4326)),
('Sodo Zuriya', 'woreda', 1, ST_SetSRID(ST_MakePoint(37.76, 6.86), 4326)),
('Damot Gale', 'woreda', 1, ST_SetSRID(ST_MakePoint(37.70, 6.90), 4326)),
('Damot Sore', 'woreda', 1, ST_SetSRID(ST_MakePoint(37.82, 6.88), 4326)),
('Boloso Sore', 'woreda', 1, ST_SetSRID(ST_MakePoint(37.68, 6.80), 4326)),
('Damot Pulasa', 'woreda', 1, ST_SetSRID(ST_MakePoint(37.78, 6.78), 4326)),
('Humbo', 'woreda', 1, ST_SetSRID(ST_MakePoint(37.72, 6.75), 4326)),
('Boloso Bombe', 'woreda', 1, ST_SetSRID(ST_MakePoint(37.65, 6.82), 4326));

-- =====================================================
-- OFFICES (WASH Offices)
-- =====================================================
INSERT INTO offices (name, type, jurisdiction_id, contact_person, email, phone, address, is_active) VALUES
('Wolaita Zone Water Office', 'zone_office', 1, 'Ato Mulugeta Bekele', 'admin@sodowater.gov.et', '+251-911-123456', 'Sodo City, Near Stadium', true),
('Sodo Zuriya Woreda Water Office', 'woreda_office', 2, 'W/ro Almaz Tadesse', 'office@sodowater.gov.et', '+251-911-234567', 'Sodo Zuriya Administration', true),
('Damot Gale Water Office', 'woreda_office', 3, 'Ato Yohannes Mamo', 'damotgale@wash.gov.et', '+251-911-345678', 'Boditi Town', true),
('Damot Sore Water Office', 'woreda_office', 4, 'W/ro Sara Alemayehu', 'damotsore@wash.gov.et', '+251-911-456789', 'Damot Sore Center', true),
('Boloso Sore Water Office', 'woreda_office', 5, 'Ato Dawit Hailu', 'bolosore@wash.gov.et', '+251-911-567890', 'Areka Town', true);

-- =====================================================
-- USERS (System Users)
-- =====================================================
-- Password: Admin@123 (hashed with bcryptjs)
-- Password: Office@123 (hashed with bcryptjs)
-- Note: In production, these should be properly hashed on the server

INSERT INTO users (name, email, phone, password_hash, role, office_id, is_active) VALUES
('Administrator', 'admin@sodowater.gov.et', '+251-911-000001', '$2a$10$XqYqBPJjJ6LkJFZ2kYCHVO8p7JFVW0cKG1kGP5Y7ZH1X2Y3Z4A5B6', 'admin', 1, true),
('Mulugeta Bekele', 'mulugeta@sodowater.gov.et', '+251-911-123456', '$2a$10$XqYqBPJjJ6LkJFZ2kYCHVO8p7JFVW0cKG1kGP5Y7ZH1X2Y3Z4A5B6', 'office_user', 1, true),
('Almaz Tadesse', 'office@sodowater.gov.et', '+251-911-234567', '$2a$10$YrZrCQKkK7MlKGZ3lZDIWP9q8KGWX1dLH2lHQ6Z8ZI2Y3Z4A5B6C7', 'office_user', 2, true),
('Yohannes Mamo', 'yohannes@wash.gov.et', '+251-911-345678', '$2a$10$YrZrCQKkK7MlKGZ3lZDIWP9q8KGWX1dLH2lHQ6Z8ZI2Y3Z4A5B6C7', 'office_user', 3, true),
('Technician Daniel', 'daniel@sodowater.gov.et', '+251-911-777001', '$2a$10$YrZrCQKkK7MlKGZ3lZDIWP9q8KGWX1dLH2lHQ6Z8ZI2Y3Z4A5B6C7', 'technician', 2, true),
('Technician Solomon', 'solomon@wash.gov.et', '+251-911-777002', '$2a$10$YrZrCQKkK7MlKGZ3lZDIWP9q8KGWX1dLH2lHQ6Z8ZI2Y3Z4A5B6C7', 'technician', 3, true);

-- =====================================================
-- WATER POINTS (Sample water infrastructure)
-- =====================================================
-- Locations around Sodo and Wolaita Zone
INSERT INTO water_points (name, type, location, address, jurisdiction_id, office_id, installation_date, current_status, population_served, notes) VALUES
-- Sodo City area
('Sodo Central Hand Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.7618, 6.8540), 4326), 'Sodo City Center, Near Market', 2, 2, '2020-03-15', 'working', 850, 'High-traffic location, serves market area'),
('Merkato Well', 'shallow_well', ST_SetSRID(ST_MakePoint(37.7580, 6.8510), 4326), 'Merkato Area, Sodo', 2, 2, '2019-07-20', 'working', 600, 'Protected shallow well'),
('Mehal Ketema Borehole', 'borehole', ST_SetSRID(ST_MakePoint(37.7650, 6.8570), 4326), 'Mehal Ketema, Sodo', 2, 2, '2021-01-10', 'reported_broken', 1200, 'Deep borehole, electric pump'),
('Arada Hand Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.7590, 6.8580), 4326), 'Arada Area, Near School', 2, 2, '2018-11-05', 'working', 500, 'Near elementary school'),

-- Rural areas in Sodo Zuriya
('Bossa Village Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.7420, 6.8620), 4326), 'Bossa Village', 2, 2, '2019-05-12', 'working', 350, 'Serves three farming hamlets'),
('Warza Community Well', 'protected_spring', ST_SetSRID(ST_MakePoint(37.7380, 6.8450), 4326), 'Warza, Rural Sodo', 2, 2, '2020-08-22', 'working', 280, 'Natural spring protection'),
('Dinkara Hand Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.7710, 6.8680), 4326), 'Dinkara Village', 2, 2, '2021-04-18', 'reported_broken', 420, 'Pump handle broken'),

-- Damot Gale (Boditi area)
('Boditi Town Well', 'shallow_well', ST_SetSRID(ST_MakePoint(37.6980, 6.9020), 4326), 'Boditi Town Center', 3, 3, '2020-02-14', 'working', 950, 'Main water source for Boditi'),
('Shanto Hand Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.7050, 6.9150), 4326), 'Shanto Village, Damot Gale', 3, 3, '2019-09-30', 'working', 380, 'Community-maintained'),
('Gacheno Borehole', 'borehole', ST_SetSRID(ST_MakePoint(37.6920, 6.8950), 4326), 'Gacheno Area', 3, 3, '2021-06-20', 'under_repair', 780, 'Pump motor repair in progress'),

-- Boloso Sore (Areka area)
('Areka Central Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.6810, 6.7990), 4326), 'Areka Town Center', 5, 5, '2018-12-10', 'working', 1100, 'High-capacity pump'),
('Bale Village Well', 'shallow_well', ST_SetSRID(ST_MakePoint(37.6750, 6.8080), 4326), 'Bale Village', 5, 5, '2020-05-15', 'working', 450, 'Recently rehabilitated'),
('Gununo Hand Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.6880, 6.7920), 4326), 'Gununo Village', 5, 5, '2019-03-22', 'reported_broken', 520, 'No water flow reported'),

-- Damot Sore
('Sore Market Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.8180, 6.8820), 4326), 'Sore Market Area', 4, 4, '2020-10-08', 'working', 680, 'Market day high usage'),
('Otona Protected Spring', 'protected_spring', ST_SetSRID(ST_MakePoint(37.8250, 6.8750), 4326), 'Otona Village', 4, 4, '2021-02-25', 'working', 290, 'Spring protection with tap stand'),

-- Additional rural locations
('Gesuba Hand Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.7280, 6.8320), 4326), 'Gesuba Area', 2, 2, '2019-08-14', 'working', 310, 'Serves remote community'),
('Kindo Well', 'shallow_well', ST_SetSRID(ST_MakePoint(37.7850, 6.8420), 4326), 'Kindo Village', 2, 2, '2020-11-30', 'working', 540, 'Hand-dug well with pump'),
('Delbo Village Pump', 'hand_pump', ST_SetSRID(ST_MakePoint(37.7120, 6.8780), 4326), 'Delbo Village', 2, 2, '2021-07-12', 'working', 400, 'New installation'),
('Bitena Borehole', 'borehole', ST_SetSRID(ST_MakePoint(37.7490, 6.8350), 4326), 'Bitena Area', 2, 2, '2018-05-20', 'working', 890, 'Solar-powered pump'),
('Humbo Town Well', 'shallow_well', ST_SetSRID(ST_MakePoint(37.7180, 6.7520), 4326), 'Humbo Town', 7, 2, '2019-12-18', 'working', 720, 'Protected well with platform');

-- =====================================================
-- REPORTS (Sample citizen reports)
-- =====================================================
INSERT INTO reports (water_point_id, reporter_name, reporter_phone, fault_type, description, priority, status, office_id, reported_at) VALUES
(3, 'Aster Kebede', '+251-911-888001', 'no_water', 'The pump motor is not working. No water coming out since yesterday morning.', 'high', 'acknowledged', 2, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(7, 'Tesfaye Alemu', '+251-911-888002', 'pump_broken', 'Pump handle is broken and cannot be operated.', 'urgent', 'in_progress', 2, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(10, 'Marta Girma', '+251-911-888003', 'no_water', 'Motor stopped working two days ago. Community walking 2km to next water point.', 'high', 'in_progress', 3, CURRENT_TIMESTAMP - INTERVAL '3 days'),
(13, 'Dawit Lemma', '+251-911-888004', 'no_water', 'No water flow from the pump. Many families affected.', 'urgent', 'reported', 5, CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Add some resolved reports for history
INSERT INTO reports (water_point_id, reporter_name, reporter_phone, fault_type, description, priority, status, office_id, assigned_technician_id, resolution_notes, reported_at, acknowledged_at, started_at, resolved_at) VALUES
(2, 'Sara Haile', '+251-911-888005', 'contaminated', 'Water appears cloudy and has unusual smell.', 'high', 'resolved', 2, 5, 'Well was cleaned and disinfected. Water tested and safe.', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(4, 'Bekele Tadesse', '+251-911-888006', 'leaking', 'Water leaking from pipe joint.', 'normal', 'resolved', 2, 5, 'Pipe joint replaced and sealed properly.', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '13 days', CURRENT_TIMESTAMP - INTERVAL '12 days');

-- =====================================================
-- REPORT CONFIRMATIONS ("Me too" votes)
-- =====================================================
INSERT INTO report_confirmations (report_id, confirmer_name, confirmer_phone) VALUES
(1, 'Meskerem Ayele', '+251-911-888010'),
(1, 'Getachew Mamo', '+251-911-888011'),
(2, 'Tigist Bekele', '+251-911-888012'),
(2, 'Abebe Wolde', '+251-911-888013'),
(2, 'Hanna Solomon', '+251-911-888014');

-- =====================================================
-- MAINTENANCE LOGS
-- =====================================================
INSERT INTO maintenance_logs (water_point_id, technician_id, maintenance_type, description, parts_replaced, performed_at) VALUES
(1, 5, 'routine', 'Regular maintenance check and lubrication', 'None', CURRENT_TIMESTAMP - INTERVAL '30 days'),
(2, 5, 'repair', 'Fixed leak and cleaned well', 'Pipe joint gasket', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(8, 6, 'routine', 'Inspection and minor adjustments', 'None', CURRENT_TIMESTAMP - INTERVAL '20 days'),
(11, 5, 'routine', 'Quarterly maintenance check', 'None', CURRENT_TIMESTAMP - INTERVAL '45 days');

-- =====================================================
-- VERIFY DATA INTEGRITY
-- =====================================================
-- Count records
SELECT 'Jurisdictions' AS entity, COUNT(*) AS count FROM jurisdictions
UNION ALL
SELECT 'Offices', COUNT(*) FROM offices
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Water Points', COUNT(*) FROM water_points
UNION ALL
SELECT 'Reports', COUNT(*) FROM reports
UNION ALL
SELECT 'Confirmations', COUNT(*) FROM report_confirmations
UNION ALL
SELECT 'Maintenance Logs', COUNT(*) FROM maintenance_logs;

-- Display summary
SELECT 
    'Database seeded successfully for Wolaita Zone, South Ethiopia' AS message,
    CURRENT_TIMESTAMP AS seed_time;
