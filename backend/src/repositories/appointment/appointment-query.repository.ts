export const appointmentQueryCreateAppointment = `-- appointmentQueryCreateAppointment
  INSERT INTO appointments (doctor_id, patient_id, room_id, time_range)
  VALUES ($1, $2, $3, tstzrange($4::timestamptz, $5::timestamptz, '[)'))
`

export function appointmentQueryGetAppointmentsByServiceId(whereCond: string[]){
  return `-- appointmentQueryGetAppointmentsByServiceId
    SELECT
      ds.doctor_id AS doctor_id,
      a.room_id AS room_id,
      json_build_object(
        'start', lower(a.time_range),
        'end', upper(a.time_range)
      ) AS time_range
    FROM appointments a
    INNER JOIN doctor_services ds ON a.doctor_service_id = ds.id
    INNER JOIN services s ON ds.service_id = s.id AND s.id = $1
    INNER JOIN rooms r ON a.room_id = r.id AND r.clinic_id = $2
    WHERE a.time_range && tstzrange($3, $4, '[)')
    ${whereCond.join("\n    ")}
    ORDER BY a.time_range
  `
}

export const getDoctorBookedAppointments = `-- getDoctorBookedAppointments
  SELECT 
    a.id AS id,
    d.name AS doctor_name,
    r.name AS room_name,
    p.name AS patient_name,
    s.name AS service_name,
    lower(a.time_range) AS starts_at,
    upper(a.time_range) AS ends_at
  FROM appointments a
  INNER JOIN doctor_services ds ON a.doctor_service_id = ds.id
  INNER JOIN doctors d ON ds.doctor_id = d.id AND d.id = $1
  INNER JOIN patients p ON a.patient_id = p.id
  INNER JOIN services s ON ds.service_id = s.id
  INNER JOIN rooms r ON a.room_id = r.id AND r.clinic_id = $2
  WHERE a.time_range && tstzrange($3, $4, '[]')
  ORDER BY a.time_range ASC
`;

export const cancelAppointmentQuery = `-- cancelAppointmentQuery
  DELETE FROM appointments a
  USING rooms r
  WHERE a.id = $1 AND a.room_id = r.id AND r.clinic_id = $2
`;