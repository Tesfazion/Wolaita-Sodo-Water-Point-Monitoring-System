-- Run this script to create the database if it doesn't exist
-- psql -U postgres -h localhost -p 8869 -f setup-database.sql

-- Create database
CREATE DATABASE "Water_Point_Monitoring_System";

-- Connect to the database
\c "Water_Point_Monitoring_System"

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS is installed
SELECT PostGIS_Version();
