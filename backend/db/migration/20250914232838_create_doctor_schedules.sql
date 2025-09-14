-- +migrator UP
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    working_hours TSRANGE NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS doctor_schedules;
