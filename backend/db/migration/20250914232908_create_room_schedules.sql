-- +migrator UP
CREATE TABLE IF NOT EXISTS room_schedules (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    working_hours TSRANGE NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS room_schedules;
