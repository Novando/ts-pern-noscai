export const appointmentQueryCreateAppointment = `-- appointmentQueryCreateAppointment
  INSERT INTO appointments (doctor_id, patient_id, room_id, time_range)
  VALUES ($1, $2, $3, tstzrange($4::timestamptz, $5::timestamptz, '[)'))
`

export const appointmentQueryGetAppointmentsByServiceId = `-- appointmentQueryGetAppointmentsByServiceId
  SELECT
    a.doctor_id AS doctor_id,
    a.room_id AS room_id,
    json_build_object(
      'start', lower(a.time_range),
      'end', upper(a.time_range)
    ) AS time_range
  FROM appointments a
  INNER JOIN services s ON a.room_id = s.room_id AND s.id = $1
  WHERE a.time_range && tstzrange($2, $3, '[)')
  ORDER BY a.time_range
`