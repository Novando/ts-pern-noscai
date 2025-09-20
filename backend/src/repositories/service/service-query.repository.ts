export const serviceQueryGetServicesByClinicId = `-- serviceQueryGetServicesByClinicId
  SELECT s.id, s.name FROM services s
  INNER JOIN rooms r ON s.room_id = r.id AND r.clinic_id = $1
  ORDER BY s.name ASC
`;