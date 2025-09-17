import type {Dayjs} from "dayjs";


export type DoctorScheduleCheckWorkingHourParam = {
  doctorId: number
  day: 0|1|2|3|4|5|6
  startsAt: Dayjs
  endsAt: Dayjs
}