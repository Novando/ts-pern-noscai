-- +migrator UP
-- +migrator statement BEGIN

-- Assign services to doctors based on their specialties
-- Each doctor is assigned 2-4 services they can perform
-- Using ON CONFLICT DO NOTHING to skip duplicates

-- Primary Care Doctors (IDs 1-4) - General services
INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Sarah Johnson (1)
(1, 1), (1, 2), (1, 3), (1, 4)  -- General services
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Michael Chen (2)
(2, 1), (2, 2), (2, 5), (2, 6)  -- General services + some procedures
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Emily Wilson (3)
(3, 1), (3, 2), (3, 7), (3, 8)  -- General services + consults
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Robert Garcia (4)
(4, 1), (4, 2), (4, 9), (4, 10) -- Geriatrics focus
ON CONFLICT (doctor_id, service_id) DO NOTHING;

-- Pediatricians (IDs 5-6)
INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Jennifer Lee (5)
(5, 4), (5, 5), (5, 11)         -- Pediatric services
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. David Kim (6)
(6, 4), (6, 12), (6, 13)        -- Pediatric cardiology
ON CONFLICT (doctor_id, service_id) DO NOTHING;

-- Imaging Specialists (IDs 7-8)
INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Matthew Clark (7)
(7, 7), (7, 8), (7, 9), (7, 10)  -- All imaging services
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Sophia Lewis (8)
(8, 7), (8, 8), (8, 9), (8, 10)  -- All imaging services
ON CONFLICT (doctor_id, service_id) DO NOTHING;

-- General Practice (IDs 9-10)
INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. James Wilson (9)
(9, 1), (9, 2), (9, 3), (9, 4)   -- General practice services
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Elizabeth Brown (10)
(10, 1), (10, 2), (10, 5), (10, 6) -- Family medicine
ON CONFLICT (doctor_id, service_id) DO NOTHING;

-- Special Procedures (IDs 11-13)
INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Richard Taylor (11)
(11, 11), (11, 12), (11, 13)     -- Minor procedures
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Patricia Martinez (12)
(12, 11), (12, 12), (12, 13)     -- Clinical procedures
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Kevin White (13)
(13, 1), (13, 2), (13, 11), (13, 13) -- Emergency services
ON CONFLICT (doctor_id, service_id) DO NOTHING;

-- Nursing Staff (IDs 14-16)
INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Olivia Chen (14)
(14, 2), (14, 5), (14, 6)        -- Nursing procedures
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Andrew Wright (15)
(15, 2), (15, 5), (15, 6)        -- Nursing procedures
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Victoria Scott (16)
(16, 2), (16, 5), (16, 6)        -- Nursing procedures
ON CONFLICT (doctor_id, service_id) DO NOTHING;

-- Lab Specialists (IDs 17-18)
INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Benjamin Hall (17)
(17, 7), (17, 8), (17, 9), (17, 10) -- Lab services
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Natalie Young (18)
(18, 7), (18, 8), (18, 9), (18, 10) -- Lab services
ON CONFLICT (doctor_id, service_id) DO NOTHING;

-- Additional Specialists (IDs 19-20)
INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Daniel Park (19)
(19, 3), (19, 4), (19, 5)        -- Allergy/Immunology
ON CONFLICT (doctor_id, service_id) DO NOTHING;

INSERT INTO doctor_services (doctor_id, service_id) VALUES
-- Dr. Lisa Thompson (20)
(20, 9), (20, 10), (20, 11)      -- Wound care and treatments
ON CONFLICT (doctor_id, service_id) DO NOTHING;

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all doctor-service relationships
TRUNCATE TABLE doctor_services RESTART IDENTITY CASCADE;

-- +migrator statement END
