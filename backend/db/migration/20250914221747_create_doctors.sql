-- +migrator UP
CREATE TABLE IF NOT EXISTS doctors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS doctors;
