-- +migrator UP
-- +migrator statement BEGIN

-- Insert 100 patients distributed across 5 clinics (20 patients per clinic)
-- Clinic 1: Downtown Medical Center
INSERT INTO patients (clinic_id, name) VALUES
(1, 'John Smith'), (1, 'Emma Johnson'), (1, 'Michael Williams'), (1, 'Sophia Brown'), (1, 'James Jones'),
(1, 'Olivia Garcia'), (1, 'Robert Miller'), (1, 'Ava Davis'), (1, 'William Rodriguez'), (1, 'Isabella Martinez'),
(1, 'David Hernandez'), (1, 'Mia Lopez'), (1, 'Joseph Gonzalez'), (1, 'Charlotte Wilson'), (1, 'Thomas Anderson'),
(1, 'Amelia Thomas'), (1, 'Charles Taylor'), (1, 'Harper Moore'), (1, 'Daniel Jackson'), (1, 'Evelyn Martin');

-- Clinic 2: Riverside Family Clinic
INSERT INTO patients (clinic_id, name) VALUES
(2, 'Matthew Lee'), (2, 'Abigail Thompson'), (2, 'Anthony White'), (2, 'Emily Harris'), (2, 'Mark Sanchez'),
(2, 'Elizabeth Clark'), (2, 'Donald Lewis'), (2, 'Sofia Robinson'), (2, 'Steven Walker'), (2, 'Avery Young'),
(2, 'Paul Allen'), (2, 'Camila King'), (2, 'Kevin Scott'), (2, 'Chloe Wright'), (2, 'Jason Green'),
(2, 'Victoria Baker'), (2, 'Ryan Adams'), (2, 'Scarlett Nelson'), (2, 'Jacob Hill'), (2, 'Madison Rivera');

-- Clinic 3: Sunset Hills Medical Group
INSERT INTO patients (clinic_id, name) VALUES
(3, 'Gary Mitchell'), (3, 'Luna Carter'), (3, 'Nicholas Roberts'), (3, 'Layla Turner'), (3, 'Eric Phillips'),
(3, 'Zoe Campbell'), (3, 'Jonathan Parker'), (3, 'Lily Evans'), (3, 'Joshua Edwards'), (3, 'Chloe Collins'),
(3, 'Andrew Stewart'), (3, 'Penelope Morris'), (3, 'Brandon Rogers'), (3, 'Aria Reed'), (3, 'Justin Cook'),
(3, 'Eleanor Morgan'), (3, 'Raymond Bell'), (3, 'Hazel Murphy'), (3, 'Samuel Bailey'), (3, 'Violet Rivera');

-- Clinic 4: Pineview Community Health
INSERT INTO patients (clinic_id, name) VALUES
(4, 'Patrick Cooper'), (4, 'Stella Richardson'), (4, 'Jack Cox'), (4, 'Nora Howard'), (4, 'Dylan Ward'),
(4, 'Ellie Torres'), (4, 'Christian Peterson'), (4, 'Hannah Gray'), (4, 'Austin Ramirez'), (4, 'Lillian James'),
(4, 'Ethan Watson'), (4, 'Natalie Brooks'), (4, 'Caleb Kelly'), (4, 'Zoey Sanders'), (4, 'Nathan Price'),
(4, 'Leah Bennett'), (4, 'Cameron Wood'), (4, 'Savannah Barnes'), (4, 'Evan Ross'), (4, 'Audrey Henderson');

-- Clinic 5: Maplewood Healthcare Services
INSERT INTO patients (clinic_id, name) VALUES
(5, 'Kyle Coleman'), (5, 'Claire Jenkins'), (5, 'Bryan Perry'), (5, 'Skylar Powell'), (5, 'Gabriel Long'),
(5, 'Ariana Hughes'), (5, 'Tyler Flores'), (5, 'Aaliyah Washington'), (5, 'Jose Butler'), (5, 'Nevaeh Simmons'),
(5, 'Mason Foster'), (5, 'Bella Gonzales'), (5, 'Eli Bryant'), (5, 'Paisley Alexander'), (5, 'Nathaniel Russell'),
(5, 'Kinsley Griffin'), (5, 'Isaiah Hayes'), (5, 'Autumn Myers'), (5, 'Julian Ford'), (5, 'Piper Hamilton');

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all patients
TRUNCATE TABLE patients CASCADE;

-- +migrator statement END
