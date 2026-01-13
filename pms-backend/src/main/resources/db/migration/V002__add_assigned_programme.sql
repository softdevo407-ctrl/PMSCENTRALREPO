-- Add assigned_programme_id column to users table
ALTER TABLE users ADD COLUMN assigned_programme_id BIGINT;

-- Add index for assigned_programme_id
CREATE INDEX idx_users_assigned_programme_id ON users(assigned_programme_id);
