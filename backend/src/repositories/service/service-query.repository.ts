export const serviceQueryGetServicesByClinicId = `-- serviceQueryGetServicesByClinicId
  SELECT s.id, s.name, s.duration_minutes FROM services s
  INNER JOIN rooms r ON s.room_id = r.id AND r.clinic_id = $1
  ORDER BY s.name ASC
`;

export const serviceQueryGetDoctorsByServiceIdAndClinicIdRepository = `-- serviceQueryGetDoctorsByServiceIdAndClinicIdRepository
  SELECT DISTINCT d.id as ID, d.name AS name
  FROM doctors d
  INNER JOIN doctor_services ds ON d.id = ds.doctor_id
  INNER JOIN services s ON ds.service_id = s.id AND s.id = $1
  INNER JOIN rooms r ON s.room_id = r.id AND r.clinic_id = $2
  ORDER BY d.name
`;
