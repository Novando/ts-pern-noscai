export type DoctorScheduleCheckWorkingHourParam = {
  doctorId: number
  day: 0|1|2|3|4|5|6
  startsAt: Date
  endsAt: Date
}