-- +migrator UP
-- +migrator statement BEGIN

-- Insert services with shared rooms
-- Note: Multiple services can share the same room
INSERT INTO services (room_id, name, duration_minutes, buffer) VALUES
    -- Downtown Medical Center services (rooms 1-3)
    -- Room 1: Shared by General Checkup, Blood Pressure Check, and Allergy Test
    (1, 'General Checkup', 30, 10),
    (1, 'Blood Pressure Check', 15, 5),
    (1, 'Allergy Test', 45, 10),

    -- Room 2: Shared by Pediatric Checkup and Child Vaccination
    (2, 'Pediatric Checkup', 45, 15),
    (2, 'Child Vaccination', 30, 10),

    -- Room 3: X-Ray and Ultrasound share the same imaging room
    (3, 'X-Ray', 60, 15),
    (3, 'Ultrasound', 45, 15),

    -- Riverside Family Clinic services (rooms 4-6)
    -- Room 4: Shared by Annual Physical and Diabetes Screening
    (4, 'Annual Physical', 45, 10),
    (4, 'Diabetes Screening', 30, 10),

    -- Room 5: Shared by Vaccination and Flu Shot
    (5, 'Vaccination', 20, 5),
    (5, 'Flu Shot', 15, 5),

    -- Room 6: Minor Procedure and Dressing Change
    (6, 'Minor Procedure', 90, 20),
    (6, 'Dressing Change', 20, 5),

    -- Sunset Hills Medical Group services (rooms 7-9)
    -- Room 7: Consultation and Mental Health Evaluation
    (7, 'Consultation', 60, 10),
    (7, 'Mental Health Evaluation', 50, 10),

    -- Room 8: Therapy Session and Counseling
    (8, 'Therapy Session', 50, 10),
    (8, 'Counseling', 50, 10),

    -- Room 9: Treatment and Wound Care
    (9, 'Treatment', 30, 10),
    (9, 'Wound Care', 30, 10),

    -- Pineview Community Health services (rooms 10-11)
    -- Room 10: General Medicine and Prescription Refill
    (10, 'General Medicine', 30, 10),
    (10, 'Prescription Refill', 15, 5),

    -- Room 11: Lab Test and Blood Draw share the lab
    (11, 'Lab Test', 45, 15),
    (11, 'Blood Draw', 20, 10),

    -- Maplewood Healthcare Services (rooms 12-13)
    -- Room 12: Comprehensive Exam and Executive Physical
    (12, 'Comprehensive Exam', 60, 15),
    (12, 'Executive Physical', 90, 20),

    -- Room 13: Quick Visit and Medication Review
    (13, 'Quick Visit', 15, 5),
    (13, 'Medication Review', 20, 5),

    -- Additional shared services
    -- Room 1 can also be used for these quick procedures
    (1, 'Ear Irrigation', 15, 5),
    (1, 'Nebulizer Treatment', 30, 10),

    -- Room 3 can also be used for other imaging
    (3, 'Bone Density Scan', 30, 15),

    -- Room 11 can also be used for other lab work
    (11, 'Urine Test', 15, 5),
    (11, 'Stool Test', 15, 5);

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all services
TRUNCATE TABLE services CASCADE;

-- +migrator statement END