-- +migrator UP
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    buffer INTEGER NOT NULL,

    CONSTRAINT fk_services_room_id FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- +migrator DOWN
DROP TABLE IF EXISTS services;
