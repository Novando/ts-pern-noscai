export type CreateAppointmentParam = {
  doctorServiceId: number
  patientId: number
  roomId: number
  startsAt: Date
  endsAt: Date
}

export type GetAppointmentsByServiceIdEntity = {
  doctorId: number
  roomId: number
  timeRange: {
    start: Date
    end: Date
  }
}