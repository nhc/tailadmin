-- Add currency column to payments table
ALTER TABLE users 
ADD COLUMN currency VARCHAR(5) NOT NULL DEFAULT 'GBP';

-- Add an index on currency for better query performance
CREATE INDEX idx_users_currency ON users(currency);