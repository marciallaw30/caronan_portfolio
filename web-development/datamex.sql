sql
-- Sections Table: Handles grouping students by year level and strand (for SHS)
CREATE TABLE IF NOT EXISTS sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year_level VARCHAR(20),                        -- e.g. 'G11', 'C1'
    section_name VARCHAR(120),                     -- e.g. 'G11-ABM-Section-1'
    capacity INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Students Table: Stores student information
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    student_id VARCHAR(120) UNIQUE,                -- e.g. 'DCSA2025-G11-0001'
    email VARCHAR(150),
    phone VARCHAR(50),
    course VARCHAR(150),
    year_level VARCHAR(20),                        -- canonical: G1..G12, C1..C4
    password VARCHAR(255),
    section VARCHAR(120) DEFAULT '',               -- assigned section name
    enrollment_note TEXT,
    student_number INT DEFAULT NULL,               -- position in section (1..30)
    strand VARCHAR(80) DEFAULT '',                 -- for SHS: ABM, HUMSS, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
