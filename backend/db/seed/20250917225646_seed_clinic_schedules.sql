-- +migrator UP
-- +migrator statement BEGIN

-- Set standard working hours for all clinics
-- Monday to Friday: 8:00 AM - 5:00 PM
-- Saturday: 9:00 AM - 1:00 PM
-- Sunday: Closed

-- Function to generate clinic schedules
DO $$
DECLARE
clinic_id_var INT;
    day_of_week_var INT;
    start_time TIMETZ;
    end_time TIMETZ;
BEGIN
    -- For each clinic (IDs 1-5)
FOR clinic_id_var IN 1..5 LOOP
        -- Monday to Friday (0-4)
        FOR day_of_week_var IN 0..4 LOOP
            start_time := '08:00:00+02'::timetz;
            end_time := '17:00:00+02'::timetz;

INSERT INTO clinic_schedules (clinic_id, day_of_week, starts_at, ends_at)
VALUES (
           clinic_id_var,
           day_of_week_var,
           start_time,
           end_time
       )
    ON CONFLICT DO NOTHING;
END LOOP;

        -- Saturday (5)
        start_time := '09:00:00+02'::timetz;
        end_time := '13:00:00+02'::timetz;

INSERT INTO clinic_schedules (clinic_id, day_of_week, starts_at, ends_at)
VALUES (
           clinic_id_var,
           5,
           start_time,
           end_time
       )
    ON CONFLICT DO NOTHING;

-- Sunday (6) - Clinic is closed, no schedule
END LOOP;
END $$;

-- Add lunch breaks for each clinic schedule
-- This adds a 1-hour lunch break from 12:00 PM to 1:00 PM on weekdays
INSERT INTO clinic_schedule_break_hours (clinic_schedule_id, starts_at, ends_at)
SELECT
    cs.id,
    '12:00:00+02'::timetz,
    '13:00:00+02'::timetz
FROM
    clinic_schedules cs
WHERE
    cs.day_of_week BETWEEN 0 AND 4
    ON CONFLICT DO NOTHING;

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Remove inserted lunch breaks
DELETE FROM clinic_schedule_break_hours
WHERE (starts_at, ends_at) = ('12:00:00+02'::timetz, '13:00:00+02'::timetz);

-- Remove generated clinic schedules (IDs 1–5, Mon–Sat only)
DELETE FROM clinic_schedules
WHERE clinic_id BETWEEN 1 AND 5
  AND day_of_week BETWEEN 0 AND 5;

-- +migrator statement END
