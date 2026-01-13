-- Create project_definitions table
CREATE TABLE IF NOT EXISTS project_definitions (
    id BIGSERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) UNIQUE NOT NULL,
    programme_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget_code VARCHAR(50) NOT NULL,
    lead_centre VARCHAR(255) NOT NULL,
    project_director_id BIGINT REFERENCES users(id),
    programme_director_id BIGINT REFERENCES users(id),
    sanctioned_amount BIGINT NOT NULL,
    revised_sanctioned_amount BIGINT,
    sanctioned_date DATE NOT NULL,
    end_date DATE NOT NULL,
    revised_end_date DATE,
    revised_date_remarks VARCHAR(500),
    revised_date_approved_by_chairman BOOLEAN DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'ON_TRACK',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_project_definitions_project_director ON project_definitions(project_director_id);
CREATE INDEX idx_project_definitions_programme_director ON project_definitions(programme_director_id);
CREATE INDEX idx_project_definitions_short_name ON project_definitions(short_name);
CREATE INDEX idx_project_definitions_category ON project_definitions(category);
CREATE INDEX idx_project_definitions_status ON project_definitions(status);
