-- Add timezone and location fields to user table
-- Migration: 20250711172923_add_timezone_country_to_user.sql

ALTER TABLE "users" 
ADD COLUMN timezone VARCHAR(50),
ADD COLUMN location VARCHAR(100);

-- Add comments for documentation
COMMENT ON COLUMN "users".timezone IS 'User timezone (e.g., America/New_York, Europe/London)';
COMMENT ON COLUMN "users".location IS 'User location/country (e.g., United States, United Kingdom)';
