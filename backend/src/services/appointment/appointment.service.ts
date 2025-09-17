import type {Pool} from "pg";
import type {DoctorServiceRepository} from "../../repositories/doctor-service/doctor-service.repository";
import {createAppointmentService} from "./create-appointment.service";
import type {ClinicScheduleRepository} from "../../repositories/clinic-schedule/clinic-schedule.repository";
import type {RoomScheduleRepository} from "../../repositories/room-schedule/room-schedule.repository";
import type {DoctorScheduleRepository} from "../../repositories/doctor-schedule/doctor-schedule.repository";
import {AppointmentRepository} from "../../repositories/appointment/appointment.repository";


export class AppointmentService {
  constructor(
    protected readonly db: Pool,

    protected readonly doctorServiceRepository: DoctorServiceRepository,
    protected readonly roomScheduleRepository: RoomScheduleRepository,
    protected readonly doctorScheduleRepository: DoctorScheduleRepository,
    protected readonly clinicScheduleRepository: ClinicScheduleRepository,
    protected readonly appointmentRepository: AppointmentRepository,
  ) {}

  createAppointment = createAppointmentService
}