-- +migrator UP
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    buffer INTEGER NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS services;
