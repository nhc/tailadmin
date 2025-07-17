-- Add currency column to payments table
ALTER TABLE payments 
ADD COLUMN currency VARCHAR(5) NOT NULL DEFAULT 'GBP';

-- Add an index on currency for better query performance
CREATE INDEX idx_payments_currency ON payments(currency);
