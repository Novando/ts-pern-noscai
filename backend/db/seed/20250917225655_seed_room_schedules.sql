-- +migrator UP
-- +migrator statement BEGIN

-- Set standard room availability
-- Most rooms follow clinic hours with some variations
-- Some rooms have limited availability for specific procedures

-- Function to generate room schedules
DO $$
DECLARE
    room_id_var INT;
    day_of_week_var INT;
    start_time TIME;
    end_time TIME;
    clinic_id_var INT;
    room_type TEXT;
BEGIN
    -- For each room (IDs 1-13)
    FOR room_id_var IN 1..13 LOOP
        -- Get clinic_id for this room
        SELECT clinic_id INTO clinic_id_var FROM rooms WHERE id = room_id_var;

        -- Get room type from name
        SELECT
            CASE
                WHEN name ILIKE '%xray%' OR name ILIKE '%ultrasound%' OR name ILIKE '%imaging%' THEN 'imaging'
                WHEN name ILIKE '%lab%' THEN 'lab'
                WHEN name ILIKE '%procedure%' OR name ILIKE '%surgery%' THEN 'procedure'
                ELSE 'exam'
            END INTO room_type
        FROM rooms
        WHERE id = room_id_var;

        -- Monday to Sunday (0-6)
        FOR day_of_week_var IN 0..6 LOOP
            -- Default: not available
            start_time := NULL;
            end_time := NULL;

            -- Set availability based on room type
            CASE room_type
                -- Imaging rooms (X-Ray, Ultrasound, etc.)
                WHEN 'imaging' THEN
                    IF day_of_week_var BETWEEN 0 AND 4 THEN
                        -- Weekdays: 8 AM - 6 PM
                        start_time := '08:00:00+02'::timetz;
                        end_time := '18:00:00+02'::timetz;
                    ELSIF day_of_week_var = 5 THEN
                        -- Saturday: 9 AM - 1 PM
                        start_time := '09:00:00+02'::timetz;
                        end_time := '13:00:00+02'::timetz;
                    END IF;

                -- Lab rooms
                WHEN 'lab' THEN
                    IF day_of_week_var BETWEEN 0 AND 5 THEN
                        -- Monday to Saturday: 7 AM - 5 PM
                        start_time := '07:00:00+02'::timetz;
                        end_time := '17:00:00+02'::timetz;
                    END IF;

                -- Procedure rooms
                WHEN 'procedure' THEN
                    IF day_of_week_var BETWEEN 0 AND 4 THEN
                        -- Weekdays: 8 AM - 4 PM (procedures usually end by 4 PM)
                        start_time := '08:00:00+02'::timetz;
                        end_time := '16:00:00+02'::timetz;
                    END IF;

                -- Exam rooms (default)
                ELSE
                    IF day_of_week_var BETWEEN 0 AND 4 THEN
                        -- Weekdays: 8 AM - 5 PM
                        start_time := '08:00:00+02'::timetz;
                        end_time := '17:00:00+02'::timetz;
                    ELSIF day_of_week_var = 5 THEN
                        -- Saturday: 9 AM - 1 PM
                        start_time := '09:00:00+02'::timetz;
                        end_time := '13:00:00+02'::timetz;
                    END IF;
            END CASE;

            -- Insert schedule if room is available
            IF start_time IS NOT NULL AND end_time IS NOT NULL THEN
                INSERT INTO room_schedules (room_id, day_of_week, starts_at, ends_at)
                VALUES (
                    room_id_var,
                    day_of_week_var,
                    start_time,
                    end_time
                );
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Add maintenance breaks for procedure rooms
-- 1-hour maintenance break in the middle of the day
INSERT INTO room_schedule_break_hours (room_schedule_id, starts_at, ends_at)
SELECT
    rs.id,
    '12:00:00+02'::timetz,
    '13:00:00+02'::timetz
FROM
    room_schedules rs
    JOIN rooms r ON rs.room_id = r.id
WHERE
    rs.day_of_week BETWEEN 0 AND 4 -- Monday to Friday
    AND (
        r.name ILIKE '%procedure%'
        OR r.name ILIKE '%surgery%'
        OR r.name ILIKE '%imaging%'
    );

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all room schedule break hours
TRUNCATE TABLE room_schedule_break_hours;

-- Delete all room schedules
TRUNCATE TABLE room_schedules CASCADE;

-- +migrator statement END
