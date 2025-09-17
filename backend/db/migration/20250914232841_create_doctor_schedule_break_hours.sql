-- +migrator UP
CREATE TABLE IF NOT EXISTS doctor_schedule_break_hours (
    id BIGSERIAL PRIMARY KEY,
    doctor_schedule_id BIGINT NOT NULL REFERENCES doctor_schedules(id) ON DELETE CASCADE,
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS doctor_schedule_break_hours;
