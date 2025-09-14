-- +migrator UP
CREATE TABLE IF NOT EXISTS doctors (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,

    CONSTRAINT fk_doctors_service_id FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- +migrator DOWN
DROP TABLE IF EXISTS doctors;
