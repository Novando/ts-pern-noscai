import type {Pool} from "pg";
import {createAppointmentRepository} from "./create-appointment.repository";
import {getAppointmentByServiceIdAndClinicIdRepository} from "./get-appointments-by-service-id-and-clinic-id.repository";
import {getDoctorBookedAppointmentsRepository} from "./get-doctor-booked-appointments.repository";
import {cancelAppointmentRepository} from "./cancel-appointment.repository";

export class AppointmentRepository {
  constructor(
    protected readonly db: Pool
  ) {}

  createAppointment = createAppointmentRepository;
  getAppointmentByServiceId = getAppointmentByServiceIdAndClinicIdRepository;
  getDoctorBookedAppointments = getDoctorBookedAppointmentsRepository;
  cancelAppointment = cancelAppointmentRepository;
}