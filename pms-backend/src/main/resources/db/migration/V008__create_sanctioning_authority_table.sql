-- Create sanctioning_authority table
CREATE TABLE IF NOT EXISTS pmsgeneric.sanctioningauthority (
    sanctioningauthoritycode VARCHAR(4) PRIMARY KEY,
    sanctioningauthorityfullname VARCHAR(255) NOT NULL,
    sanctioningauthorityshortname VARCHAR(50),
    hierarchyorder INT,
    fromdate DATE,
    todate DATE,
    userid VARCHAR(7),
    regstatus VARCHAR(1) DEFAULT 'A',
    regtime DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO pmsgeneric.sanctioningauthority (sanctioningauthoritycode, sanctioningauthorityfullname, sanctioningauthorityshortname, hierarchyorder, fromdate, todate, userid, regstatus, regtime) VALUES
('SA01', 'Secretary Department of Space', 'SDS', 1, '2024-01-01', NULL, 'ADMIN', 'A', '2024-01-01'),
('SA02', 'Joint Secretary Department of Space', 'JSDS', 2, '2024-01-01', NULL, 'ADMIN', 'A', '2024-01-01'),
('SA03', 'Director ISRO', 'DIR', 3, '2024-01-01', NULL, 'ADMIN', 'A', '2024-01-01'),
('SA04', 'Additional Secretary', 'AS', 4, '2024-01-01', NULL, 'ADMIN', 'A', '2024-01-01'),
('SA05', 'Financial Advisor', 'FA', 5, '2024-01-01', NULL, 'ADMIN', 'A', '2024-01-01'),
('SA06', 'Project Director', 'PD', 6, '2024-01-01', NULL, 'ADMIN', 'A', '2024-01-01');
