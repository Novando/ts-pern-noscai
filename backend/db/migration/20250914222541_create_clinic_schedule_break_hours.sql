-- +migrator UP
CREATE TABLE IF NOT EXISTS clinic_schedule_break_hours (
    id BIGSERIAL PRIMARY KEY,
    clinic_schedule_id BIGINT NOT NULL REFERENCES clinic_schedules(id) ON DELETE CASCADE,
    break_hours TSRANGE NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS clinic_schedule_break_hours;
