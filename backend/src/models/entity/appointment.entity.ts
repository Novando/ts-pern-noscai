import type {Dayjs} from "dayjs";


export type CreateAppointmentParam = {
  doctorId: number
  patientId: number
  roomId: number
  startsAt: Dayjs
  endsAt: Dayjs
}