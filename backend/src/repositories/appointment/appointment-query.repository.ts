export const appointmentQueryCreateAppointment = `-- appointmentQueryCreateAppointment
  INSERT INTO appointments (doctor_id, patient_id, room_id, time_range)
  VALUES ($1, $2, $3, tstzrange($4::timestamptz, $5::timestamptz, '[)'))
`