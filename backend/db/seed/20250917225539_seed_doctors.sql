-- +migrator UP
-- +migrator statement BEGIN

-- Insert 20 doctors (about 2/3 of the services count)
-- Each doctor is assigned a primary specialty that matches our services
INSERT INTO doctors (name) VALUES
-- Primary Care (4 doctors)
('Dr. Sarah Johnson'),
('Dr. Michael Chen'),
('Dr. Emily Wilson'),
('Dr. Robert Garcia'),

-- Pediatrics (2 doctors)
('Dr. Jennifer Lee'),
('Dr. David Kim'),

-- Imaging Specialists (2 doctors)
('Dr. Matthew Clark'),
('Dr. Sophia Lewis'),

-- General Practice (2 doctors)
('Dr. James Wilson'),
('Dr. Elizabeth Brown'),

-- Special Procedures (3 doctors)
('Dr. Richard Taylor'),
('Dr. Patricia Martinez'),
('Dr. Kevin White'),

-- Nursing Staff (3 doctors)
('Dr. Olivia Chen'),
('Dr. Andrew Wright'),
('Dr. Victoria Scott'),

-- Lab Specialists (2 doctors)
('Dr. Benjamin Hall'),
('Dr. Natalie Young'),

-- Additional Specialists (2 doctors)
('Dr. Daniel Park'),
('Dr. Lisa Thompson');

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all doctors
TRUNCATE TABLE doctors CASCADE;

-- +migrator statement END