-- Create project_phases table
CREATE TABLE IF NOT EXISTS project_phases (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES project_definitions(id) ON DELETE CASCADE,
    phase_name VARCHAR(255) NOT NULL,
    phase_weight INTEGER NOT NULL CHECK (phase_weight >= 0 AND phase_weight <= 100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create phase_milestones table
CREATE TABLE IF NOT EXISTS phase_milestones (
    id BIGSERIAL PRIMARY KEY,
    phase_id BIGINT NOT NULL REFERENCES project_phases(id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    milestone_weight INTEGER NOT NULL CHECK (milestone_weight >= 0 AND milestone_weight <= 100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create milestone_activities table
CREATE TABLE IF NOT EXISTS milestone_activities (
    id BIGSERIAL PRIMARY KEY,
    milestone_id BIGINT NOT NULL REFERENCES phase_milestones(id) ON DELETE CASCADE,
    activity_name VARCHAR(255) NOT NULL,
    activity_weight INTEGER NOT NULL CHECK (activity_weight >= 0 AND activity_weight <= 100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_project_phases_project_id ON project_phases(project_id);
CREATE INDEX idx_phase_milestones_phase_id ON phase_milestones(phase_id);
CREATE INDEX idx_milestone_activities_milestone_id ON milestone_activities(milestone_id);
