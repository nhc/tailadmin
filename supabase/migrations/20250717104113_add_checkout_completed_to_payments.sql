-- Add checkout_completed column to payments table
ALTER TABLE payments 
ADD COLUMN checkout_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Add an index on checkout_completed for better query performance
CREATE INDEX idx_payments_checkout_completed ON payments(checkout_completed);

-- Add a comment to document the column purpose
COMMENT ON COLUMN payments.checkout_completed IS 'Indicates whether the Stripe checkout process has been completed'; 