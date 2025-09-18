-- +migrator UP
-- +migrator statement BEGIN

-- Add varying break times for each clinic schedule
-- Each clinic has different break times to simulate real-world scenarios

-- Function to generate clinic schedule breaks
DO $$
DECLARE
    clinic_schedule RECORD;
    break_start TIME;
    break_end TIME;
    break_duration INTERVAL;
    break_offset INTERVAL;
    clinic_id_var INT;
    day_shift INT;
BEGIN
    -- For each clinic schedule
    FOR clinic_schedule IN
        SELECT cs.id, cs.clinic_id, cs.day_of_week, cs.starts_at, cs.ends_at
        FROM clinic_schedules cs
        WHERE cs.day_of_week BETWEEN 0 AND 4 -- Monday to Friday only
        ORDER BY cs.clinic_id, cs.day_of_week
    LOOP
        -- Set different break times based on clinic and day
        clinic_id_var := clinic_schedule.clinic_id % 5 + 1; -- Ensure we have a clinic ID between 1-5
        day_shift := clinic_schedule.day_of_week;

        -- Calculate break times with some variation
        -- Each clinic has a different break pattern
        CASE clinic_id_var
            WHEN 1 THEN -- Clinic 1: Early lunch
                break_start := '11:30:00'::TIME + (day_shift * INTERVAL '15 minutes');
                break_duration := '45 minutes'::INTERVAL;
            WHEN 2 THEN -- Clinic 2: Split breaks
                break_start := '11:00:00'::TIME + (day_shift * INTERVAL '10 minutes');
                break_duration := '30 minutes'::INTERVAL;

                -- Insert first break
                INSERT INTO clinic_schedule_break_hours (clinic_schedule_id, starts_at, ends_at)
                VALUES (
                    clinic_schedule.id,
                    (break_start)::timetz,
                    (break_start + break_duration)::timetz
                );

                -- Second break in the afternoon
                break_start := '14:00:00'::TIME + (day_shift * INTERVAL '5 minutes');
                break_duration := '15 minutes'::INTERVAL;
            WHEN 3 THEN -- Clinic 3: Late lunch
                break_start := '12:30:00'::TIME - (day_shift * INTERVAL '10 minutes');
                break_duration := '1 hour'::INTERVAL;
            WHEN 4 THEN -- Clinic 4: Two short breaks
                break_start := '10:30:00'::TIME + (day_shift * INTERVAL '5 minutes');
                break_duration := '15 minutes'::INTERVAL;

                -- Insert first break
                INSERT INTO clinic_schedule_break_hours (clinic_schedule_id, starts_at, ends_at)
                VALUES (
                    clinic_schedule.id,
                    (break_start)::timetz,
                    (break_start + break_duration)::timetz
                );

                -- Second break
                break_start := '14:30:00'::TIME - (day_shift * INTERVAL '5 minutes');
                break_duration := '15 minutes'::INTERVAL;
            WHEN 5 THEN -- Clinic 5: Variable breaks based on day
                CASE day_shift
                    WHEN 0 THEN -- Monday: Early break
                        break_start := '10:00:00'::TIME;
                        break_duration := '30 minutes'::INTERVAL;
                    WHEN 1 THEN -- Tuesday: Late break
                        break_start := '13:00:00'::TIME;
                        break_duration := '45 minutes'::INTERVAL;
                    WHEN 2 THEN -- Wednesday: Two breaks
                        break_start := '11:00:00'::TIME;
                        break_duration := '30 minutes'::INTERVAL;

                        -- First break
                        INSERT INTO clinic_schedule_break_hours (clinic_schedule_id, starts_at, ends_at)
                        VALUES (
                            clinic_schedule.id,
                            (break_start)::timetz,
                            (break_start + break_duration)::timetz
                        );

                        -- Second break
                        break_start := '15:00:00'::TIME;
                        break_duration := '30 minutes'::INTERVAL;
                    WHEN 3 THEN -- Thursday: Late lunch
                        break_start := '13:00:00'::TIME;
                        break_duration := '1 hour'::INTERVAL;
                    ELSE -- Friday: Early finish
                        break_start := '14:00:00'::TIME;
                        break_duration := '45 minutes'::INTERVAL;
                END CASE;
        END CASE;

        -- Insert the break if not already inserted (for clinics with multiple breaks)
        IF clinic_id_var != 2 AND clinic_id_var != 4 AND (clinic_id_var != 5 OR day_shift != 2) THEN
            INSERT INTO clinic_schedule_break_hours (clinic_schedule_id, starts_at, ends_at)
            VALUES (
                clinic_schedule.id,
                (break_start)::timetz,
                (break_start + break_duration)::timetz
            );
        END IF;

    END LOOP;
END $$;

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all clinic schedule break hours
TRUNCATE TABLE clinic_schedule_break_hours;

-- +migrator statement END
