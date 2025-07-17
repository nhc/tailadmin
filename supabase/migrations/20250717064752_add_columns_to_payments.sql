-- Add claim_id column to payments table
ALTER TABLE payments ADD COLUMN claim_id UUID REFERENCES claims(id) ON DELETE SET NULL;

-- Alter amount column from DECIMAL(10,2) to INTEGER
ALTER TABLE payments ALTER COLUMN amount TYPE INTEGER USING (amount * 100)::INTEGER;

-- Alter platform_fee column from DECIMAL(10,2) to INTEGER
ALTER TABLE payments ALTER COLUMN platform_fee TYPE INTEGER USING (platform_fee * 100)::INTEGER;

-- Alter payout_amount column from DECIMAL(10,2) to INTEGER
ALTER TABLE payments ALTER COLUMN payout_amount TYPE INTEGER USING (payout_amount * 100)::INTEGER;

-- Add index for claim_id for better performance
CREATE INDEX idx_payments_claim_id ON payments(claim_id);
