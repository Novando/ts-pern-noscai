export const patientQueryGetPatientsByClinicId = `-- patientQueryGetPatientsByClinicId
  SELECT id, name FROM patients WHERE clinic_id = $1
`