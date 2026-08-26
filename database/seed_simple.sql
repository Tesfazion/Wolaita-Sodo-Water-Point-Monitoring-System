-- Wolaita Sodo Water-Point Monitoring System Sample Data (Simplified - No PostGIS)
-- Wolaita Zone, South Ethiopia Region
-- This file populates the database with realistic sample data

-- =====================================================
-- JURISDICTIONS (Wolaita Zone Woredas)
-- =====================================================
-- Wolaita Zone center: approximately 6.85°N, 37.75°E (Sodo City area)

INSERT INTO jurisdictions (name, woreda_name, zone_name, region_name, population, center_lat, center_lng) VALUES
('Sodo Zuriya', 'Sodo Zuriya', 'Wolaita', 'South Ethiopia', 180000, 6.86, 37.76),
('Damot Gale', 'Damot Gale', 'Wolaita', 'South Ethiopia', 165000, 6.90, 37.70),
('Damot Sore', 'Damot Sore', 'Wolaita', 'South Ethiopia', 155000, 6.88, 37.82),
('Boloso Sore', 'Boloso Sore', 'Wolaita', 'South Ethiopia', 145000, 6.80, 37.68),
('Damot Pulasa', 'Damot Pulasa', 'Wolaita', 'South Ethiopia', 120000, 6.78, 37.78);

-- =====================================================
-- OFFICES (WASH Offices)
-- =====================================================
INSERT INTO offices (name, office_type, jurisdiction_id, address, phone, email, contact_person) VALUES
('Wolaita Zone Water Office', 'zone', 1, 'Sodo City, Near Stadium', '+251-911-123456', 'admin@sodowater.gov.et', 'Ato Mulugeta Bekele'),
('Sodo Zuriya Woreda Water Office', 'woreda', 1, 'Sodo Zuriya Administration', '+251-911-234567', 'office@sodowater.gov.et', 'W/ro Almaz Tadesse'),
('Damot Gale Water Office', 'woreda', 2, 'Boditi Town', '+251-911-345678', 'damotgale@wash.gov.et', 'Ato Yohannes Mamo'),
('Damot Sore Water Office', 'woreda', 3, 'Damot Sore Center', '+251-911-456789', 'damotsore@wash.gov.et', 'W/ro Sara Alemayehu'),
('Boloso Sore Water Office', 'woreda', 4, 'Areka Town', '+251-911-567890', 'bolosore@wash.gov.et', 'Ato Dawit Hailu');

-- =====================================================
-- USERS (System Users)
-- =====================================================
-- Password for admin@sodowater.gov.et: Admin@123
-- Password for office@sodowater.gov.et: Office@123
-- Password for technicians: Tech@123
-- All passwords are hashed with bcryptjs

INSERT INTO users (name, email, phone, password_hash, role, office_id, is_active) VALUES
('Administrator', 'admin@sodowater.gov.et', '+251-911-000001', '$2a$10$XqYqBPJjJ6LkJFZ2kYCHVO8p7JFVW0cKG1kGP5Y7ZH1X2Y3Z4A5B6', 'admin', 1, true),
('Mulugeta Bekele', 'mulugeta@sodowater.gov.et', '+251-911-123456', '$2a$10$XqYqBPJjJ6LkJFZ2kYCHVO8p7JFVW0cKG1kGP5Y7ZH1X2Y3Z4A5B6', 'office_user', 1, true),
('Almaz Tadesse', 'office@sodowater.gov.et', '+251-911-234567', '$2a$10$YrZrCQKkK7MlKGZ3lZDIWP9q8KGWX1dLH2lHQ6Z8ZI2Y3Z4A5B6C7', 'office_user', 2, true),
('Yohannes Mamo', 'yohannes@wash.gov.et', '+251-911-345678', '$2a$10$YrZrCQKkK7MlKGZ3lZDIWP9q8KGWX1dLH2lHQ6Z8ZI2Y3Z4A5B6C7', 'office_user', 3, true),
('Technician Daniel', 'daniel@sodowater.gov.et', '+251-911-777001', '$2a$10$YrZrCQKkK7MlKGZ3lZDIWP9q8KGWX1dLH2lHQ6Z8ZI2Y3Z4A5B6C7', 'technician', 2, true),
('Technician Solomon', 'solomon@wash.gov.et', '+251-911-777002', '$2a$10$YrZrCQKkK7MlKGZ3lZDIWP9q8KGWX1dLH2lHQ6Z8ZI2Y3Z4A5B6C7', 'technician', 3, true),
('Technician Marta', 'marta@bolosore.gov.et', '+251-911-777003', '$2a$10$YrZrCQKkK7MlKGZ3lZDIWP9q8KGWX1dLH2lHQ6Z8ZI2Y3Z4A5B6C7', 'technician', 5, true);

-- =====================================================
-- WATER POINTS (Sample water infrastructure)
-- =====================================================
-- Locations around Sodo and Wolaita Zone
INSERT INTO water_points (name, type, latitude, longitude, address, jurisdiction_id, office_id, installation_date, current_status, beneficiaries) VALUES
-- Sodo City area (Sodo Zuriya)
('Sodo Central Hand Pump', 'hand_pump', 6.8540, 37.7618, 'Sodo City Center, Near Market', 1, 2, '2020-03-15', 'working', 850),
('Merkato Well', 'shallow_well', 6.8510, 37.7580, 'Merkato Area, Sodo', 1, 2, '2019-07-20', 'working', 600),
('Mehal Ketema Borehole', 'borehole', 6.8570, 37.7650, 'Mehal Ketema, Sodo', 1, 2, '2021-01-10', 'broken', 1200),
('Arada Hand Pump', 'hand_pump', 6.8580, 37.7590, 'Arada Area, Near School', 1, 2, '2018-11-05', 'working', 500),

-- Rural areas in Sodo Zuriya
('Bossa Village Pump', 'hand_pump', 6.8620, 37.7420, 'Bossa Village', 1, 2, '2019-05-12', 'working', 350),
('Warza Community Well', 'protected_spring', 6.8450, 37.7380, 'Warza, Rural Sodo', 1, 2, '2020-08-22', 'working', 280),
('Dinkara Hand Pump', 'hand_pump', 6.8680, 37.7710, 'Dinkara Village', 1, 2, '2021-04-18', 'broken', 420),

-- Damot Gale (Boditi area)
('Boditi Town Well', 'shallow_well', 6.9020, 37.6980, 'Boditi Town Center', 2, 3, '2020-02-14', 'working', 950),
('Shanto Hand Pump', 'hand_pump', 6.9150, 37.7050, 'Shanto Village, Damot Gale', 2, 3, '2019-09-30', 'working', 380),
('Gacheno Borehole', 'borehole', 6.8950, 37.6920, 'Gacheno Area', 2, 3, '2021-06-20', 'under_repair', 780),

-- Boloso Sore (Areka area)
('Areka Central Pump', 'hand_pump', 6.7990, 37.6810, 'Areka Town Center', 4, 5, '2018-12-10', 'working', 1100),
('Bale Village Well', 'shallow_well', 6.8080, 37.6750, 'Bale Village', 4, 5, '2020-05-15', 'working', 450),
('Gununo Hand Pump', 'hand_pump', 6.7920, 37.6880, 'Gununo Village', 4, 5, '2019-03-22', 'broken', 520),

-- Damot Sore
('Sore Market Pump', 'hand_pump', 6.8820, 37.8180, 'Sore Market Area', 3, 4, '2020-10-08', 'working', 680),
('Otona Protected Spring', 'protected_spring', 6.8750, 37.8250, 'Otona Village', 3, 4, '2021-02-25', 'working', 290),

-- Additional rural locations
('Gesuba Hand Pump', 'hand_pump', 6.8320, 37.7280, 'Gesuba Area', 1, 2, '2019-08-14', 'working', 310),
('Kindo Well', 'shallow_well', 6.8420, 37.7850, 'Kindo Village', 1, 2, '2020-11-30', 'working', 540),
('Delbo Village Pump', 'hand_pump', 6.8780, 37.7120, 'Delbo Village', 1, 2, '2021-07-12', 'working', 400),
('Bitena Borehole', 'borehole', 6.8350, 37.7490, 'Bitena Area', 1, 2, '2018-05-20', 'working', 890),
('Humbo Town Well', 'shallow_well', 6.7520, 37.7180, 'Humbo Town', 1, 2, '2019-12-18', 'working', 720);

-- =====================================================
-- REPORTS (Sample citizen reports)
-- =====================================================
INSERT INTO reports (water_point_id, reporter_name, reporter_phone, reporter_email, fault_type, description, priority, status, office_id, assigned_technician_id, reported_at, resolved_at) VALUES
-- Active/pending reports
(3, 'Aster Kebede', '+251-911-888001', 'aster@example.com', 'no_water', 'The pump motor is not working. No water coming out since yesterday morning.', 'high', 'acknowledged', 2, 5, CURRENT_TIMESTAMP - INTERVAL '2 days', NULL),
(7, 'Tesfaye Alemu', '+251-911-888002', 'tesfaye@example.com', 'pump_broken', 'Pump handle is broken and cannot be operated.', 'urgent', 'in_progress', 2, 5, CURRENT_TIMESTAMP - INTERVAL '5 days', NULL),
(10, 'Marta Girma', '+251-911-888003', 'marta@example.com', 'no_water', 'Motor stopped working two days ago. Community walking 2km to next water point.', 'high', 'in_progress', 3, 6, CURRENT_TIMESTAMP - INTERVAL '3 days', NULL),
(13, 'Dawit Lemma', '+251-911-888004', 'dawit@example.com', 'no_water', 'No water flow from the pump. Many families affected.', 'urgent', 'reported', 5, 7, CURRENT_TIMESTAMP - INTERVAL '1 day', NULL),

-- Resolved reports for history
(2, 'Sara Haile', '+251-911-888005', 'sara@example.com', 'contaminated', 'Water appears cloudy and has unusual smell.', 'high', 'resolved', 2, 5, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(4, 'Bekele Tadesse', '+251-911-888006', 'bekele@example.com', 'leaking', 'Water leaking from pipe joint.', 'normal', 'resolved', 2, 5, CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '12 days'),
(8, 'Tigist Assefa', '+251-911-888007', 'tigist@example.com', 'low_pressure', 'Water pressure is very low in the morning.', 'normal', 'resolved', 3, 6, CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '18 days'),
(11, 'Abebe Worku', '+251-911-888008', 'abebe@example.com', 'leaking', 'Leak at the base of the pump.', 'normal', 'resolved', 5, 7, CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP - INTERVAL '23 days');

-- =====================================================
-- REPORT CONFIRMATIONS ("Me too" votes)
-- =====================================================
INSERT INTO report_confirmations (report_id, confirmer_name, confirmer_phone) VALUES
(1, 'Meskerem Ayele', '+251-911-888010'),
(1, 'Getachew Mamo', '+251-911-888011'),
(1, 'Rahel Kassa', '+251-911-888012'),
(2, 'Tigist Bekele', '+251-911-888013'),
(2, 'Abebe Wolde', '+251-911-888014'),
(2, 'Hanna Solomon', '+251-911-888015'),
(3, 'Yohannes Desta', '+251-911-888016'),
(3, 'Almaz Tesfaye', '+251-911-888017'),
(4, 'Daniel Hailu', '+251-911-888018'),
(4, 'Sara Mamo', '+251-911-888019'),
(4, 'Mekonnen Alemu', '+251-911-888020');

-- =====================================================
-- STATUS HISTORY (Populated by trigger automatically)
-- =====================================================
-- The trigger will automatically populate this when report statuses change
-- Adding some manual entries for resolved reports
INSERT INTO status_history (report_id, old_status, new_status, changed_by, notes, changed_at) VALUES
(5, 'reported', 'acknowledged', 5, 'Report acknowledged by technician', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(5, 'acknowledged', 'in_progress', 5, 'Started investigation', CURRENT_TIMESTAMP - INTERVAL '9 days'),
(5, 'in_progress', 'resolved', 5, 'Well cleaned and disinfected. Water tested and safe.', CURRENT_TIMESTAMP - INTERVAL '7 days'),
(6, 'reported', 'acknowledged', 5, 'Report received', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(6, 'acknowledged', 'in_progress', 5, 'Working on repair', CURRENT_TIMESTAMP - INTERVAL '13 days'),
(6, 'in_progress', 'resolved', 5, 'Pipe joint replaced and sealed properly.', CURRENT_TIMESTAMP - INTERVAL '12 days');

-- =====================================================
-- MAINTENANCE LOGS
-- =====================================================
INSERT INTO maintenance_logs (water_point_id, technician_id, maintenance_type, description, cost, performed_at) VALUES
(1, 5, 'routine', 'Regular maintenance check and lubrication', 150.00, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(2, 5, 'repair', 'Fixed leak and cleaned well. Replaced pipe joint gasket.', 450.00, CURRENT_TIMESTAMP - INTERVAL '7 days'),
(4, 5, 'repair', 'Replaced pipe joint and sealed connection', 380.00, CURRENT_TIMESTAMP - INTERVAL '12 days'),
(8, 6, 'routine', 'Inspection and minor adjustments', 120.00, CURRENT_TIMESTAMP - INTERVAL '20 days'),
(11, 7, 'routine', 'Quarterly maintenance check', 100.00, CURRENT_TIMESTAMP - INTERVAL '45 days'),
(14, 5, 'preventive', 'Cleaned pump mechanism and checked valves', 200.00, CURRENT_TIMESTAMP - INTERVAL '35 days'),
(16, 5, 'routine', 'General inspection and cleaning', 110.00, CURRENT_TIMESTAMP - INTERVAL '40 days'),
(19, 6, 'repair', 'Fixed motor issue and tested pump', 680.00, CURRENT_TIMESTAMP - INTERVAL '50 days');

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
SELECT 'Status History', COUNT(*) FROM status_history
UNION ALL
SELECT 'Maintenance Logs', COUNT(*) FROM maintenance_logs;

-- Display summary
SELECT 
    'Database seeded successfully for Wolaita Zone, South Ethiopia' AS message,
    CURRENT_TIMESTAMP AS seed_time;
