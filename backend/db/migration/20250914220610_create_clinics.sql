-- +migrator UP
CREATE TABLE IF NOT EXISTS clinics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS clinics;
