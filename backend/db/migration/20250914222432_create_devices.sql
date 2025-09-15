-- +migrator UP
CREATE TABLE IF NOT EXISTS devices (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,

    CONSTRAINT fk_devices_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- +migrator DOWN
DROP TABLE IF EXISTS devices;
