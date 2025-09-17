-- +migrator UP
CREATE TABLE IF NOT EXISTS doctor_services (
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, service_id)
);

-- +migrator DOWN
DROP TABLE IF EXISTS room_schedule_break_hours;
