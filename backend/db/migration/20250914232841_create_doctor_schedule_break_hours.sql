-- +migrator UP
CREATE TABLE IF NOT EXISTS doctor_schedule_break_hours (
    id BIGSERIAL PRIMARY KEY,
    doctor_schedule_id BIGINT NOT NULL REFERENCES doctor_schedules(id) ON DELETE CASCADE,
    break_hours TSRANGE NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS doctor_schedule_break_hours;
