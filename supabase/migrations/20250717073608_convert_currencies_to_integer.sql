-- Convert tasks.price from DECIMAL(10,2) to INTEGER
-- This stores prices in the smallest currency unit (e.g., cents for USD, pence for GBP)
ALTER TABLE tasks ALTER COLUMN price TYPE INTEGER USING (price * 100)::INTEGER;

-- Add a comment to document the change
COMMENT ON COLUMN tasks.price IS 'Price stored in smallest currency unit (e.g., cents for USD, pence for GBP)';
