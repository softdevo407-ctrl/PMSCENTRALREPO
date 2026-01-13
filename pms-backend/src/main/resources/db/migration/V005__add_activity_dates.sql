-- Add startDate and endDate columns to milestone_activities table
ALTER TABLE milestone_activities
ADD COLUMN start_date TIMESTAMP,
ADD COLUMN end_date TIMESTAMP,
ADD COLUMN revised_end_date TIMESTAMP;

-- Update existing rows with default values (current timestamp)
UPDATE milestone_activities 
SET start_date = created_date, end_date = created_date 
WHERE start_date IS NULL;

-- Make columns NOT NULL after populating
ALTER TABLE milestone_activities
ALTER COLUMN start_date SET NOT NULL,
ALTER COLUMN end_date SET NOT NULL;

-- Add milestone_order to phase_milestones for ordering
ALTER TABLE phase_milestones
ADD COLUMN milestone_order INT DEFAULT 0;

-- Add constraint to ensure end_date is after start_date
ALTER TABLE milestone_activities
ADD CONSTRAINT chk_activity_dates CHECK (end_date > start_date);

-- Add constraint to ensure weight is valid
ALTER TABLE milestone_activities
ADD CONSTRAINT chk_activity_weight CHECK (activity_weight >= 0 AND activity_weight <= 100);
ALTER TABLE milestone_activities
ADD CONSTRAINT chk_activity_weight CHECK (activity_weight >= 0 AND activity_weight <= 100);

