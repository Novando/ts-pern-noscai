-- +migrator UP
-- +migrator statement BEGIN

-- Add varying break times for each room's schedule
-- Each room has different maintenance and cleaning times

-- Function to generate room schedule breaks
DO $$
DECLARE
    room_schedule RECORD;
    break_start TIMETZ;
    break_end TIMETZ;
    break_duration INTERVAL;
    room_id_var INT;
    room_type TEXT;
    day_shift INT;
    i INT;

BEGIN
    -- For each room schedule (Monday to Friday only)
    FOR room_schedule IN
        SELECT rs.id, rs.room_id, rs.day_of_week, rs.starts_at, rs.ends_at, r.name as room_name
        FROM room_schedules rs
        JOIN rooms r ON rs.room_id = r.id
        WHERE rs.day_of_week BETWEEN 0 AND 4 -- Monday to Friday only
        ORDER BY rs.room_id, rs.day_of_week
    LOOP
        room_id_var := room_schedule.room_id;
        day_shift := room_schedule.day_of_week;

        -- Determine room type from name
        room_type := CASE
            WHEN room_schedule.room_name ILIKE '%xray%' OR room_schedule.room_name ILIKE '%ultrasound%' OR room_schedule.room_name ILIKE '%imaging%'
                THEN 'imaging'
            WHEN room_schedule.room_name ILIKE '%lab%'
                THEN 'lab'
            WHEN room_schedule.room_name ILIKE '%procedure%' OR room_schedule.room_name ILIKE '%surgery%'
                THEN 'procedure'
            ELSE 'exam'
        END;

        -- Generate breaks based on room type
        CASE room_type
            WHEN 'procedure' THEN
                -- Procedure rooms need cleaning between procedures
                break_start := '12:00:00+02:00'::timetz + (room_id_var::text || ' minutes')::interval;
                break_duration := '30 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO room_schedule_break_hours (room_schedule_id, starts_at, ends_at)
                VALUES (room_schedule.id, break_start, break_end);

                -- Add evening cleaning
                break_start := '16:00:00+02:00'::timetz - (room_id_var::text || ' minutes')::interval;
                break_duration := '30 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO room_schedule_break_hours (room_schedule_id, starts_at, ends_at)
                VALUES (room_schedule.id, break_start, break_end);

            WHEN 'imaging' THEN
                -- Imaging rooms need calibration breaks
                break_start := '10:30:00+02:00'::timetz + (room_id_var::text || ' minutes')::interval;
                break_duration := '45 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO room_schedule_break_hours (room_schedule_id, starts_at, ends_at)
                VALUES (room_schedule.id, break_start, break_end);

                -- Mid-afternoon break
                break_start := '14:30:00+02:00'::timetz - (room_id_var::text || ' minutes')::interval;
                break_end := break_start + break_duration;

                INSERT INTO room_schedule_break_hours (room_schedule_id, starts_at, ends_at)
                VALUES (room_schedule.id, break_start, break_end);

            WHEN 'lab' THEN
                -- Lab rooms need equipment maintenance
                break_start := '11:00:00+02:00'::timetz + (room_id_var::text || ' minutes')::interval;
                break_duration := '20 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO room_schedule_break_hours (room_schedule_id, starts_at, ends_at)
                VALUES (room_schedule.id, break_start, break_end);

            ELSE -- Exam rooms
                -- Standard break time for exam rooms
                break_start := '12:30:00+02:00'::timetz + (room_id_var::text || ' minutes')::interval;
                break_duration := '15 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO room_schedule_break_hours (room_schedule_id, starts_at, ends_at)
                VALUES (room_schedule.id, break_start, break_end);
        END CASE;

        -- Add random short breaks for all room types
        FOR i IN 1..(1 + floor(random() * 2))::INT LOOP
            break_start := '09:00:00+02:00'::timetz + (random() * 7 * 60 * 60 * interval '1 second');
            break_duration := '15 minutes'::interval;
            break_end := break_start + break_duration;

            -- Ensure break is within working hours
            IF break_end <= '17:00:00+02:00'::timetz THEN
                INSERT INTO room_schedule_break_hours (room_schedule_id, starts_at, ends_at)
                VALUES (room_schedule.id, break_start, break_end);
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all room schedule break hours
TRUNCATE TABLE room_schedule_break_hours;

-- +migrator statement END
