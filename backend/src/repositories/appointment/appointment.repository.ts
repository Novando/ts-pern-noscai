import type {Pool} from "pg";
import {createAppointmentRepository} from "./create-appointment.repository";
import {getAppointmentByServiceIdAndClinicIdRepository} from "./get-appointments-by-service-id-and-clinic-id.repository";

export class AppointmentRepository {
  constructor(
    protected readonly db: Pool
  ){}

  createAppointment = createAppointmentRepository
  getAppointmentByServiceId= getAppointmentByServiceIdAndClinicIdRepository
}