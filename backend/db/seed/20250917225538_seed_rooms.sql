-- +migrator UP
-- +migrator statement BEGIN

-- Insert rooms for each clinic
INSERT INTO rooms (clinic_id, name) VALUES
    -- Downtown Medical Center (clinic_id: 1)
    (1, 'Examination Room 1'),
    (1, 'Examination Room 2'),
    (1, 'X-Ray Room'),

    -- Riverside Family Clinic (clinic_id: 2)
    (2, 'Exam Room A'),
    (2, 'Exam Room B'),
    (2, 'Procedure Room'),

    -- Sunset Hills Medical Group (clinic_id: 3)
    (3, 'Consultation Room 1'),
    (3, 'Consultation Room 2'),
    (3, 'Treatment Room'),

    -- Pineview Community Health (clinic_id: 4)
    (4, 'Exam Room 1'),
    (4, 'Lab Room'),

    -- Maplewood Healthcare Services (clinic_id: 5)
    (5, 'Primary Exam Room'),
    (5, 'Secondary Exam Room');

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all rooms
TRUNCATE TABLE rooms CASCADE;

-- +migrator statement END