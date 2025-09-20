import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import type {AppointmentRepository} from "./appointment.repository";
import {appointmentQueryGetAppointmentsByServiceId} from "./appointment-query.repository";
import type {GetAppointmentsByServiceIdEntity} from "../../models/entity/appointment.entity";
import {Logger} from "../../utils/logger.util";


export async function getAppointmentByServiceIdAndClinicIdRepository(
  this: AppointmentRepository,
  serviceId: number,
  clinicId: number,
  startAt: Date,
  endAt: Date,
  doctorId?: number,
): Promise<GetAppointmentsByServiceIdEntity[]> {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.db;

    const res = await db.query(
      appointmentQueryGetAppointmentsByServiceId(doctorId ? [`AND ds.doctor_id = ${doctorId}`] : [""]),
      [serviceId, clinicId, startAt, endAt],
    )

    return res.rows.map<GetAppointmentsByServiceIdEntity>((item) => ({
      doctorId: item.doctor_id,
      roomId: item.room_id,
      timeRange: {
        start: new Date(item.time_range.start),
        end: new Date(item.time_range.end),
      }
    }))
  } catch (e) {
    Logger.error('getAppointmentByServiceIdAndClinicIdRepository', e)
    throw e
  }
}