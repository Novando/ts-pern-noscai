import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import type {AppointmentRepository} from "./appointment.repository";
import type {CreateAppointmentParam} from "../../models/entity/appointment.entity";
import {appointmentQueryCreateAppointment} from "./appointment-query.repository";


export async function createAppointmentRepository(this: AppointmentRepository, param: CreateAppointmentParam) {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const res = await db.query(
    appointmentQueryCreateAppointment,
    [param.doctorId, param.patientId, param.roomId, param.startsAt.toISOString(), param.endsAt.toISOString()],
  )
  if (res.rows.length < 1) throw Error('Clinic schedule unavailable')
}