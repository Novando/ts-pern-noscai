import type {Pool} from "pg";
import {createAppointmentRepository} from "./create-appointment.repository";


export class AppointmentRepository {
  constructor(
    protected readonly db: Pool
  ){}

  createAppointment = createAppointmentRepository
}