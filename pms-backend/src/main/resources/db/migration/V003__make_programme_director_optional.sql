-- Make programme_director_id nullable as it's assigned later in the workflow
ALTER TABLE project_definitions
ALTER COLUMN programme_director_id DROP NOT NULL;
