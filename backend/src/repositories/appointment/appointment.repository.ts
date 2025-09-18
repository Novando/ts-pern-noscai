import type {Pool} from "pg";
import {createAppointmentRepository} from "./create-appointment.repository";
import {getAppointmentByServiceIdRepository} from "./get-appointments-by-service-id.repository.ts";

export class AppointmentRepository {
  constructor(
    protected readonly db: Pool
  ){}

  createAppointment = createAppointmentRepository
  getAppointmentByServiceId= getAppointmentByServiceIdRepository
}