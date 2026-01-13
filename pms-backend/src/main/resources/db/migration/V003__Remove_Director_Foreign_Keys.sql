-- Remove foreign key constraints on director columns to allow saving projects without User records
-- These constraints will be re-enabled once the User records are created

ALTER TABLE project_definitions
DROP CONSTRAINT IF EXISTS fki1n06iijyu1h7x6i7177uqogn;

ALTER TABLE project_definitions
DROP CONSTRAINT IF EXISTS fk_project_director;

-- Optional: If you want to recreate these constraints later, use:
-- ALTER TABLE project_definitions
-- ADD CONSTRAINT fk_programme_director FOREIGN KEY (programme_director_id) REFERENCES users(id);
-- ALTER TABLE project_definitions
-- ADD CONSTRAINT fk_project_director FOREIGN KEY (project_director_id) REFERENCES users(id);
