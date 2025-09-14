-- +migrator UP
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    buffer INTEGER NOT NULL,

    CONSTRAINT fk_services_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
);

-- +migrator DOWN
DROP TABLE IF EXISTS services;
