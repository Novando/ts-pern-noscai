export const doctorServiceQueryCheckDoctorService = `-- doctorServiceQueryCheckDoctorService
  SELECT
    s.duration AS duration,
    s.buffer AS buffer,
    array_agg(r.id) AS rooms
  FROM doctor_services ds
  INNER JOIN services s ON ds.service_id = s.id
  INNER JOIN rooms r ON s.room_id = r.id AND r.clinic_id = $3
  WHERE doctor_id = $1 AND service_id = $2
`