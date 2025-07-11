-- Add nickname field to users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'nickname'
    ) THEN
        ALTER TABLE users ADD COLUMN nickname VARCHAR(100);
    END IF;
END $$;

-- Add index for nickname for better performance if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'idx_users_nickname'
    ) THEN
        CREATE INDEX idx_users_nickname ON users(nickname);
    END IF;
END $$;

ALTER TABLE users ADD CONSTRAINT users_nickname_unique UNIQUE (nickname);