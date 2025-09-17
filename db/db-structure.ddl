
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Clinics table
CREATE TABLE IF NOT EXISTS clinics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    buffer INTEGER NOT NULL,
    CONSTRAINT fk_services_room_id FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Doctor Services junction table
CREATE TABLE IF NOT EXISTS doctor_services (
    doctor_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    PRIMARY KEY (doctor_id, service_id),
    CONSTRAINT fk_doctor_services_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    CONSTRAINT fk_doctor_services_service_id FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT NOT NULL,
    name VARCHAR(255),
    CONSTRAINT fk_patients_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_rooms_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT fk_devices_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    patient_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    time_range TSTZRANGE NOT NULL,
    CONSTRAINT fk_appointment_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_patient_id FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointment_room_id FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT chk_appointments_doctor_id_time_range EXCLUDE USING GIST (doctor_id WITH =, time_range WITH &&),
    CONSTRAINT chk_appointments_patient_id_time_range EXCLUDE USING GIST (patient_id WITH =, time_range WITH &&),
    CONSTRAINT chk_appointments_room_id_time_range EXCLUDE USING GIST (room_id WITH =, time_range WITH &&)
);

-- Clinic Schedules table
CREATE TABLE IF NOT EXISTS clinic_schedules (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_clinic_schedules_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- Clinic Schedule Break Hours table
CREATE TABLE IF NOT EXISTS clinic_schedule_break_hours (
    id BIGSERIAL PRIMARY KEY,
    clinic_schedule_id BIGINT NOT NULL,
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_clinic_schedule_break_hours_schedule_id FOREIGN KEY (clinic_schedule_id)
        REFERENCES clinic_schedules(id) ON DELETE CASCADE
);

-- Doctor Schedules table
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_doctor_schedules_doctor_id FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Doctor Schedule Break Hours table
CREATE TABLE IF NOT EXISTS doctor_schedule_break_hours (
    id BIGSERIAL PRIMARY KEY,
    doctor_schedule_id BIGINT NOT NULL,
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_doctor_schedule_break_hours_schedule_id FOREIGN KEY (doctor_schedule_id)
        REFERENCES doctor_schedules(id) ON DELETE CASCADE
);

-- Room Schedules table
CREATE TABLE IF NOT EXISTS room_schedules (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_room_schedules_room_id FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Room Schedule Break Hours table
CREATE TABLE IF NOT EXISTS room_schedule_break_hours (
    id BIGSERIAL PRIMARY KEY,
    room_schedule_id BIGINT NOT NULL,
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_room_schedule_break_hours_schedule_id FOREIGN KEY (room_schedule_id)
        REFERENCES room_schedules(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_room_id ON services(room_id);
CREATE INDEX IF NOT EXISTS idx_doctor_services_doctor_id ON doctor_services(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_services_service_id ON doctor_services(service_id);
CREATE INDEX IF NOT EXISTS idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_rooms_clinic_id ON rooms(clinic_id);
CREATE INDEX IF NOT EXISTS idx_devices_clinic_id ON devices(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_room_id ON appointments(room_id);
CREATE INDEX IF NOT EXISTS idx_appointments_time_range ON appointments USING GIST (time_range);
CREATE INDEX IF NOT EXISTS idx_clinic_schedules_clinic_id ON clinic_schedules(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_schedule_break_hours_schedule_id ON clinic_schedule_break_hours(clinic_schedule_id);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor_id ON doctor_schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_schedule_break_hours_schedule_id ON doctor_schedule_break_hours(doctor_schedule_id);
CREATE INDEX IF NOT EXISTS idx_room_schedules_room_id ON room_schedules(room_id);
CREATE INDEX IF NOT EXISTS idx_room_schedule_break_hours_schedule_id ON room_schedule_break_hours(room_schedule_id);