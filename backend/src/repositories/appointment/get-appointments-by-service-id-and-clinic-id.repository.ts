import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import type {AppointmentRepository} from "./appointment.repository";
import {appointmentQueryGetAppointmentsByServiceId} from "./appointment-query.repository";
import type {GetAppointmentsByServiceIdEntity} from "../../models/entity/appointment.entity";


export async function getAppointmentByServiceIdAndClinicIdRepository(
  this: AppointmentRepository,
  serviceId: number,
  clinicId: number,
  startAt: Date,
  endAt: Date,
  doctorId?: number,
): Promise<GetAppointmentsByServiceIdEntity[]> {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const res = await db.query(
    appointmentQueryGetAppointmentsByServiceId(doctorId ? ["AND ds.doctor_id = $5"] : [""]),
    [serviceId, clinicId, startAt, endAt, doctorId],
  )

  return res.rows.map<GetAppointmentsByServiceIdEntity>((item) => ({
    doctorId: item.doctor_id,
    roomId: item.room_id,
    timeRange: {
      start: new Date(item.time_range.start),
      end: new Date(item.time_range.end),
    }
  }))
}