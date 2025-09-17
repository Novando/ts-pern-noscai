-- +migrator UP
CREATE TABLE IF NOT EXISTS room_schedule_break_hours (
    id BIGSERIAL PRIMARY KEY,
    room_schedule_id BIGINT NOT NULL REFERENCES room_schedules(id) ON DELETE CASCADE,
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS room_schedule_break_hours;
