-- +migrator UP
CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT NOT NULL,
    name VARCHAR(255),

    CONSTRAINT fk_patients_clinic_id FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- +migrator DOWN
DROP TABLE IF EXISTS patients;
