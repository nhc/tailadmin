-- Add code_link column to tasks table
ALTER TABLE tasks 
ADD COLUMN code_link TEXT;

-- Add an index on code_link for better query performance
CREATE INDEX idx_tasks_code_link ON tasks(code_link);