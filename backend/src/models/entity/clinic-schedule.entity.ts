import type {Dayjs} from "dayjs";


export type ClinicScheduleCheckWorkingHourParam = {
  clinicId: number
  day: 0|1|2|3|4|5|6
  startsAt: Dayjs
  endsAt: Dayjs
}