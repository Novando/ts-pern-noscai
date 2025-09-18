-- +migrator UP
-- +migrator statement BEGIN

-- Insert sample clinics
INSERT INTO clinics (name) VALUES
    ('Downtown Medical Center'),
    ('Riverside Family Clinic'),
    ('Sunset Hills Medical Group'),
    ('Pineview Community Health'),
    ('Maplewood Healthcare Services');

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Remove the inserted clinics
DELETE FROM clinics WHERE name IN (
    'Downtown Medical Center',
    'Riverside Family Clinic',
    'Sunset Hills Medical Group',
    'Pineview Community Health',
    'Maplewood Healthcare Services'
);

-- +migrator statement END