-- Add project_type column to project_definitions
ALTER TABLE project_definitions
ADD COLUMN IF NOT EXISTS project_type VARCHAR(100) DEFAULT 'Ongoing';

-- Update existing records with default project_type if they are NULL
UPDATE project_definitions SET project_type = 'Ongoing' WHERE project_type IS NULL;

-- Add project_document_path column to project_definitions
ALTER TABLE project_definitions
ADD COLUMN IF NOT EXISTS project_document_path VARCHAR(500);

-- Create index for project_type
CREATE INDEX IF NOT EXISTS idx_project_definitions_project_type ON project_definitions(project_type);
