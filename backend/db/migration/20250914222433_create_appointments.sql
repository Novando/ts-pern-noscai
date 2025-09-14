-- +migrator UP
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    time_range TSTZRANGE NOT NULL,

    CONSTRAINT fk_appointment_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_patient_id FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_room_id FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,

    -- Following constraints to check conflicting appointments
    CONSTRAINT chk_appointments_doctor_id_time_range EXCLUDE USING GIST (doctor_id WITH =, time_range WITH &&),
    CONSTRAINT chk_appointments_patient_id_time_range EXCLUDE USING GIST (patient_id WITH =, time_range WITH &&),
    CONSTRAINT chk_appointments_room_id_time_range EXCLUDE USING GIST (room_id WITH =, time_range WITH &&)
);

-- +migrator DOWN
DROP TABLE IF EXISTS appointments;
