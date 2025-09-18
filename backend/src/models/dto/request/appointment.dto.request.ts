export type PostAppointmentDTOReq = {
  doctorId: number
  patientId: number
  serviceId: number
  clinicId: number
  startsAt: string
}