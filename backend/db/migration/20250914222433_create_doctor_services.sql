-- +migrator UP
CREATE TABLE IF NOT EXISTS doctor_services (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    CONSTRAINT uq_doctor_services_doctor_service UNIQUE (doctor_id, service_id)
);

-- +migrator DOWN
DROP TABLE IF EXISTS doctor_services;
