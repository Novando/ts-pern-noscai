import {getAsyncLocalStorage} from '../../utils/local-storage.util';
import type {BookedAppointmentDTORes} from '../../models/dto/response/doctor-schedule.dto.response';
import type {AppointmentRepository} from "./appointment.repository";
import {getDoctorBookedAppointments} from "./appointment-query.repository";

export async function getDoctorBookedAppointmentsRepository(
  this: AppointmentRepository,
  doctorId: number,
  clinicId: number,
  from: Date,
  to: Date,
): Promise<BookedAppointmentDTORes[]> {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const result = await db.query(getDoctorBookedAppointments, [
    doctorId,
    clinicId,
    from,
    to
  ]);

  return result.rows.map((item) => {
    return {
      id: item.id,
      doctorName: item.doctor_name,
      patientName: item.patient_name,
      roomName: item.room_name,
      serviceName: item.service_name,
      startsAt: item.starts_at,
      endsAt: item.ends_at,
    }
  });
}
