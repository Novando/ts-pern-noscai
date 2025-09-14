-- +migrator UP
CREATE TABLE IF NOT EXISTS room_schedule_break_hours (
    id BIGSERIAL PRIMARY KEY,
    room_schedule_id BIGINT NOT NULL REFERENCES room_schedules(id) ON DELETE CASCADE,
    break_hours TSRANGE NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS room_schedule_break_hours;
