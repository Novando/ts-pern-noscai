-- +migrator UP
-- +migrator statement BEGIN

-- Add varying break times for each doctor's schedule
-- Each doctor has different break patterns to simulate real-world scenarios

-- Function to generate doctor schedule breaks
DO $$
DECLARE
    doctor_schedule RECORD;
    break_start TIMETZ;
    break_end TIMETZ;
    break_duration INTERVAL;
    doctor_id_var INT;
    day_shift INT;
    break_pattern INT;
    i INT;

BEGIN
    -- For each doctor schedule (Monday to Friday only)
    FOR doctor_schedule IN
        SELECT ds.id, ds.doctor_id, ds.day_of_week, ds.starts_at, ds.ends_at
        FROM doctor_schedules ds
        WHERE ds.day_of_week BETWEEN 0 AND 4 -- Monday to Friday only
        ORDER BY ds.doctor_id, ds.day_of_week
    LOOP
        doctor_id_var := doctor_schedule.doctor_id;
        day_shift := doctor_schedule.day_of_week;

        -- Determine break pattern based on doctor ID (for consistency)
        break_pattern := doctor_id_var % 5;

        -- Generate 1-3 breaks per day based on the pattern
        CASE break_pattern
            WHEN 0 THEN -- Single lunch break
                break_start := ('12:00:00+07:00'::timetz + (doctor_id_var * INTERVAL '1 minute'))::timetz;
                break_duration := '30 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                VALUES (doctor_schedule.id, break_start, break_end);

            WHEN 1 THEN -- Two short breaks
                -- Morning break
                break_start := ('10:30:00+07:00'::timetz + (doctor_id_var * INTERVAL '1 minute'))::timetz;
                break_duration := '15 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                VALUES (doctor_schedule.id, break_start, break_end);

                -- Afternoon break
                break_start := ('14:30:00+07:00'::timetz - (doctor_id_var * INTERVAL '1 minute'))::timetz;
                break_end := break_start + '15 minutes'::interval;

                INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                VALUES (doctor_schedule.id, break_start, break_end);

            WHEN 2 THEN -- Variable breaks based on day of week
                CASE day_shift
                    WHEN 0 THEN -- Monday: Early break
                        break_start := ('10:00:00+07:00'::timetz + (doctor_id_var * INTERVAL '1 minute'))::timetz;
                    WHEN 1 THEN -- Tuesday: Late lunch
                        break_start := ('13:00:00+07:00'::timetz - (doctor_id_var * INTERVAL '1 minute'))::timetz;
                    WHEN 2 THEN -- Wednesday: Two breaks
                        break_start := ('10:30:00+07:00'::timetz + (doctor_id_var * INTERVAL '1 minute'))::timetz;
                        break_duration := '20 minutes'::interval;
                        break_end := break_start + break_duration;

                        INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                        VALUES (doctor_schedule.id, break_start, break_end);

                        break_start := ('14:30:00+07:00'::timetz - (doctor_id_var * INTERVAL '1 minute'))::timetz;
                        break_duration := '20 minutes'::interval;
                        break_end := break_start + break_duration;

                        INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                        VALUES (doctor_schedule.id, break_start, break_end);
                        CONTINUE; -- Skip the break insertion after the CASE
                    WHEN 3 THEN -- Thursday: Mid-day break
                        break_start := ('11:30:00+07:00'::timetz + (doctor_id_var * INTERVAL '1 minute'))::timetz;
                    ELSE -- Friday: Early afternoon break
                        break_start := ('13:30:00+07:00'::timetz - (doctor_id_var * INTERVAL '1 minute'))::timetz;
                END CASE;

                break_duration := '30 minutes'::interval;
                break_end := break_start + break_duration;
                INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                VALUES (doctor_schedule.id, break_start, break_end);

            WHEN 3 THEN -- Long lunch with short breaks
                -- Morning break
                break_start := ('10:00:00+07:00'::timetz + (doctor_id_var * INTERVAL '1 minute'))::timetz;
                break_duration := '15 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                VALUES (doctor_schedule.id, break_start, break_end);

                -- Lunch break
                break_start := ('12:30:00+07:00'::timetz - (doctor_id_var * INTERVAL '1 minute'))::timetz;
                break_duration := '45 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                VALUES (doctor_schedule.id, break_start, break_end);

                -- Afternoon break
                break_start := ('15:00:00+07:00'::timetz + (doctor_id_var * INTERVAL '1 minute'))::timetz;
                break_duration := '15 minutes'::interval;
                break_end := break_start + break_duration;

                INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                VALUES (doctor_schedule.id, break_start, break_end);

            WHEN 4 THEN -- Random breaks (1-3 per day)
                FOR i IN 1..(1 + floor(random() * 3))::INT LOOP
                    -- Random start time between 9 AM and 4 PM
                    break_start := ('09:00:00+07:00'::timetz + (random() * 7 * 60 * 60 * INTERVAL '1 second'))::timetz;
                    break_duration := '15 minutes'::interval;
                    break_end := break_start + break_duration;

                    -- Ensure break is within working hours
                    IF break_end <= '17:00:00+07:00'::timetz THEN
                        INSERT INTO doctor_schedule_break_hours (doctor_schedule_id, starts_at, ends_at)
                        VALUES (doctor_schedule.id, break_start, break_end);
                    END IF;
                END LOOP;
        END CASE;
    END LOOP;
END $$;

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all doctor schedule break hours
TRUNCATE TABLE doctor_schedule_break_hours;

-- +migrator statement END
