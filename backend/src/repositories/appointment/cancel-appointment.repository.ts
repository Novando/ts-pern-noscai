import type {AppointmentRepository} from "./appointment.repository";
import {cancelAppointmentQuery} from "./appointment-query.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";

export async function cancelAppointmentRepository(
  this: AppointmentRepository,
  appointmentId: number,
  clinicId: number
): Promise<number> {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const result = await db.query(cancelAppointmentQuery, [appointmentId, clinicId]);

  // Returns the number of rows affected
  return result.rowCount || 0;
}
