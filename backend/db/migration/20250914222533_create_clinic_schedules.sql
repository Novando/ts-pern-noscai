-- +migrator UP
CREATE TABLE IF NOT EXISTS clinic_schedules (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    starts_at TIME WITH TIME ZONE NOT NULL,
    ends_at TIME WITH TIME ZONE NOT NULL
);

-- +migrator DOWN
DROP TABLE IF EXISTS clinic_schedules;
