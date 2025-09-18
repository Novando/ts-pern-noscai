-- +migrator UP
-- +migrator statement BEGIN

-- Set standard working hours for doctors
-- Most doctors work Monday-Friday with some variations
-- Some doctors work part-time or have different schedules

-- Function to generate doctor schedules
DO $$
DECLARE
    doctor_id_var INT;
    day_of_week_var INT;
    start_time TIMETZ;
    end_time TIMETZ;
    work_day BOOLEAN;
    break_start TIMETZ;
    break_end TIMETZ;
    doctor_schedule_id INT;
    schedule_start TIMETZ;

BEGIN
    -- For each doctor (IDs 1-20)
    FOR doctor_id_var IN 1..20 LOOP
        -- Monday to Sunday (0-6)
        FOR day_of_week_var IN 0..6 LOOP
            -- Default: not working
            work_day := FALSE;

            -- Set working days based on doctor type
            -- Full-time doctors (most doctors)
            IF doctor_id_var <= 16 THEN
                -- Monday to Friday (0-4) - Full day
                IF day_of_week_var BETWEEN 0 AND 4 THEN
                    start_time := '09:00:00+02:00'::timetz;
                    end_time := '17:00:00+02:00'::timetz;
                    work_day := TRUE;
                -- Saturday - Half day for some doctors
                ELSIF day_of_week_var = 5 AND doctor_id_var % 2 = 0 THEN -- Even IDs work Saturday
                    start_time := '09:00:00+02:00'::timetz;
                    end_time := '13:00:00+02:00'::timetz;
                    work_day := TRUE;
                END IF;
            -- Part-time doctors (last 4 doctors)
            ELSE
                -- Work 3 days a week (Monday, Wednesday, Friday)
                IF day_of_week_var IN (0, 2, 4) THEN
                    start_time := '10:00:00+02:00'::timetz;
                    end_time := '15:00:00+02:00'::timetz;
                    work_day := TRUE;
                END IF;
            END IF;

            -- Insert working day if applicable
            IF work_day THEN
                INSERT INTO doctor_schedules (doctor_id, day_of_week, starts_at, ends_at)
                VALUES (
                    doctor_id_var,
                    day_of_week_var,
                    start_time,
                    end_time
                )
                RETURNING id, starts_at INTO doctor_schedule_id, schedule_start;

                -- Add lunch break for weekdays
                IF day_of_week_var BETWEEN 0 AND 4 THEN
                    -- Calculate lunch break time (4 hours after shift start)
                    break_start := start_time + interval '4 hours';
                    break_end := break_start + interval '1 hour';

                    -- Insert lunch break
                    INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                    VALUES (doctor_schedule_id, break_start, break_end);
                END IF;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all doctor schedule break hours
TRUNCATE TABLE doctor_schedule_break_hours;

-- Delete all doctor schedules
TRUNCATE TABLE doctor_schedules CASCADE;

-- +migrator statement END