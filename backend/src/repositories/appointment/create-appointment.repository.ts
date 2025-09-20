import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import type {AppointmentRepository} from "./appointment.repository";
import type {CreateAppointmentParam} from "../../models/entity/appointment.entity";
import {appointmentQueryCreateAppointment} from "./appointment-query.repository";
import {Logger} from "../../utils/logger.util";
import {AppError} from "../../utils/error.util";
import {constants} from "http2";


export async function createAppointmentRepository(this: AppointmentRepository, param: CreateAppointmentParam) {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.db;

    const res = await db.query(
      appointmentQueryCreateAppointment,
      [param.doctorServiceId, param.patientId, param.roomId, param.startsAt.toISOString(), param.endsAt.toISOString()],
    )
    if ((res.rowCount || 0) < 1) throw new AppError('Appointment creation fail')
  } catch (e) {
    const err = e as Error
    Logger.error('createAppointmentRepository', err.message)
    if (err.message.includes('chk_appointments_doctor_service_id_time_range')) throw new AppError('Doctor schedule conflict', 'CONFLIX', constants.HTTP_STATUS_CONFLICT)
    if (err.message.includes('chk_appointments_patient_id_time_range')) throw new AppError('Patient schedule conflict', 'CONFLIX', constants.HTTP_STATUS_CONFLICT)
    if (err.message.includes('chk_appointments_room_id_time_range')) throw new AppError('Room schedule conflict', 'CONFLIX', constants.HTTP_STATUS_CONFLICT)
    if (!(e instanceof AppError)) throw new AppError(err.message)
    throw e
  }
}