-- Manual SQL to add missing columns to project_definitions table
-- Run this if migrations haven't been applied

-- Check if project_type column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='project_definitions' AND column_name='project_type'
    ) THEN
        ALTER TABLE project_definitions
        ADD COLUMN project_type VARCHAR(100) DEFAULT 'Ongoing';
    END IF;
END
$$;

-- Check if project_document_path column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='project_definitions' AND column_name='project_document_path'
    ) THEN
        ALTER TABLE project_definitions
        ADD COLUMN project_document_path VARCHAR(500);
    END IF;
END
$$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_project_definitions_project_type ON project_definitions(project_type);
