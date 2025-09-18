-- +migrator UP
-- +migrator statement BEGIN

-- Create appointments for September 22-26, 2025
-- 2 appointments per service per clinic per day

-- Function to generate appointments
DO $$
DECLARE
    clinic_record RECORD;
    service_record RECORD;
    doctor_record RECORD;
    patient_record RECORD;
    room_record RECORD;
    time_slot INT;
    max_attempts INT := 10; -- Maximum attempts to find an available slot
    attempts INT;
    slot_found BOOLEAN;

    appt_date DATE;
    appt_start TIMESTAMP WITH TIME ZONE;
    appt_end TIMESTAMP WITH TIME ZONE;
    appt_time TIME;

    time_slot_interval INTERVAL = '15 minutes';
    day_shift INT;
    appt_count INT;
    is_available BOOLEAN;

BEGIN
    -- For each day from September 22-26, 2025 (Monday to Friday)
    FOR appt_date IN SELECT generate_series(
        '2025-09-22'::DATE,
        '2025-09-26'::DATE,
        '1 day'::INTERVAL
    )::DATE
    LOOP
        RAISE NOTICE 'Processing date: %', appt_date;

        -- Get day of week (0=Monday, 6=Sunday)
        day_shift := EXTRACT(DOW FROM appt_date)::INT;

        -- Skip weekends
        CONTINUE WHEN day_shift >= 5;

        -- For each clinic
        FOR clinic_record IN SELECT * FROM clinics ORDER BY id
        LOOP
            -- For each service in this clinic
            FOR service_record IN
                SELECT s.*
                FROM services s
                JOIN rooms r ON s.room_id = r.id
                WHERE r.clinic_id = clinic_record.id
                ORDER BY s.id
            LOOP
                -- Reset appointment count for this service
                appt_count := 0;

                -- Get a doctor who can perform this service
                FOR doctor_record IN
                    SELECT d.*
                    FROM doctors d
                    JOIN doctor_services ds ON d.id = ds.doctor_id
                    WHERE ds.service_id = service_record.id
                    ORDER BY random()
                    LIMIT 1
                LOOP
                    -- Get the room for this service
                    SELECT * INTO room_record FROM rooms WHERE id = service_record.room_id;

                    -- Get a patient from this clinic
                    FOR patient_record IN
                        SELECT *
                        FROM patients
                        WHERE clinic_id = clinic_record.id
                        ORDER BY random()
                        LIMIT 2
                    LOOP
                        -- Reset attempts for this patient
                        attempts := 0;
                        slot_found := FALSE;

                        -- Try to find an available time slot
                        WHILE NOT slot_found AND attempts < max_attempts LOOP
                            attempts := attempts + 1;

                            -- Calculate a random time slot within working hours (9 AM to 5 PM)
                            appt_time := '09:00:00'::TIME +
                                       (random() * 8 * 60 * interval '1 minute')::interval;

                            -- Create start and end timestamps with +02:00 timezone (no milliseconds)
                            appt_start := (appt_date + appt_time) AT TIME ZONE 'UTC+2';
                            appt_start := date_trunc('minute', appt_start); -- Remove seconds and milliseconds
                            appt_end := appt_start + (service_record.duration_minutes * INTERVAL '1 minute');

                            -- Skip if this would go past 5 PM
                            CONTINUE WHEN (appt_time + (service_record.duration_minutes * INTERVAL '1 minute')) > '17:00:00'::TIME;

                            -- Check for overlapping appointments for this room, doctor, or patient
                            SELECT NOT EXISTS (
                                SELECT 1
                                FROM appointments a
                                WHERE (
                                    (a.doctor_id = doctor_record.id
                                     OR a.room_id = room_record.id
                                     OR a.patient_id = patient_record.id)
                                    AND tstzrange(appt_start, appt_end) && a.time_range
                                )
                            ) INTO is_available;

                            -- If time slot is available, create appointment
                            IF is_available THEN
                                -- Insert the appointment with explicit timezone and no milliseconds
                                INSERT INTO appointments (
                                    doctor_id,
                                    patient_id,
                                    room_id,
                                    time_range
                                ) VALUES (
                                    doctor_record.id,
                                    patient_record.id,
                                    room_record.id,
                                    tstzrange(
                                        appt_start,
                                        appt_end,
                                        '[)'
                                    )
                                );

                                appt_count := appt_count + 1;
                                slot_found := TRUE;
                                RAISE NOTICE 'Created appointment for patient % in room % at %',
                                    patient_record.id, room_record.id, appt_start;
                            END IF;
                        END LOOP; -- WHILE loop for finding available slot

                        EXIT WHEN appt_count >= 2; -- Only need 2 appointments per service
                    END LOOP; -- patient_record

                    EXIT WHEN appt_count >= 2; -- Only need 2 appointments per service
                END LOOP; -- doctor_record

                -- Log if we couldn't create 2 appointments
                IF appt_count < 2 THEN
                    RAISE NOTICE 'Could only create % appointments for service % on %',
                        appt_count, service_record.name, appt_date;
                END IF;
            END LOOP; -- service_record
        END LOOP; -- clinic_record
    END LOOP; -- appt_date
END $$;

-- +migrator statement END

-- +migrator DOWN
-- +migrator statement BEGIN

-- Delete all appointments in the date range
DELETE FROM appointments
WHERE lower(time_range) >= (('2025-09-22 00:00:00+02:00')::TIMESTAMPTZ AT TIME ZONE 'UTC+2')
  AND lower(time_range) < (('2025-09-27 00:00:00+02:00')::TIMESTAMPTZ AT TIME ZONE 'UTC+2');

-- +migrator statement END
