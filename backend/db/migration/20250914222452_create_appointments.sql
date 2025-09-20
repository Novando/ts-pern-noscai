-- +migrator UP
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    doctor_service_id BIGINT NOT NULL REFERENCES doctor_services(id) ON DELETE CASCADE,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    time_range TSTZRANGE NOT NULL,

    -- Following constraints to check conflicting appointments
    CONSTRAINT chk_appointments_doctor_service_id_time_range EXCLUDE USING GIST (doctor_service_id WITH =, time_range WITH &&),
    CONSTRAINT chk_appointments_patient_id_time_range EXCLUDE USING GIST (patient_id WITH =, time_range WITH &&),
    CONSTRAINT chk_appointments_room_id_time_range EXCLUDE USING GIST (room_id WITH =, time_range WITH &&)
);

-- +migrator DOWN
DROP TABLE IF EXISTS appointments;
