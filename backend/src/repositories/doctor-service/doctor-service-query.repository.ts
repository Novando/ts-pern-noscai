export const doctorServiceQueryCheckDoctorService = `-- doctorServiceQueryCheckDoctorService
  SELECT
    ds.id AS id,
    s.duration_minutes AS duration_minutes,
    s.buffer AS buffer,
    array_agg(r.id) AS rooms
  FROM doctor_services ds
  INNER JOIN services s ON ds.service_id = s.id
  INNER JOIN rooms r ON s.room_id = r.id AND r.clinic_id = $3
  WHERE ds.doctor_id = $1 AND ds.service_id = $2
  GROUP BY ds.id, s.duration_minutes, s.buffer
`