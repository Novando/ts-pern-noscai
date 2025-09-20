

export type GetServiceAvailabilityDTOReq = {
  serviceId: number
  clinicId: number
  doctorId?: number | undefined
  selectedTime: Date
}
