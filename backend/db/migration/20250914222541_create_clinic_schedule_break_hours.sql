-- +migrator UP
CREATE TABLE IF NOT EXISTS clinic_schedule_break_hours (
    id BIGSERIAL PRIMARY KEY,
    clinic_schedule_id BIGINT NOT NULL REFERENCES clinic_schedules(id) ON DELETE CASCADE,
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS clinic_schedule_break_hours;
