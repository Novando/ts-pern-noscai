import type {Pool} from "pg";
import type {DoctorServiceRepository} from "../../repositories/doctor-service/doctor-service.repository";
import {createAppointmentService} from "./create-appointment.service";
import type {ClinicScheduleRepository} from "../../repositories/clinic-schedule/clinic-schedule.repository";
import type {RoomScheduleRepository} from "../../repositories/room-schedule/room-schedule.repository";
import type {DoctorScheduleRepository} from "../../repositories/doctor-schedule/doctor-schedule.repository";
import {AppointmentRepository} from "../../repositories/appointment/appointment.repository";
import {cancelAppointmentService} from "./cancel-appointment.service";

type Constructor = {
  db: Pool
  doctorServiceRepository: DoctorServiceRepository
  roomScheduleRepository: RoomScheduleRepository
  doctorScheduleRepository: DoctorScheduleRepository
  clinicScheduleRepository: ClinicScheduleRepository
  appointmentRepository: AppointmentRepository
}

export class AppointmentService {
  protected readonly db: Pool
  protected readonly doctorServiceRepository: DoctorServiceRepository
  protected readonly roomScheduleRepository: RoomScheduleRepository
  protected readonly doctorScheduleRepository: DoctorScheduleRepository
  protected readonly clinicScheduleRepository: ClinicScheduleRepository
  protected readonly appointmentRepository: AppointmentRepository

  constructor(param: Constructor) {
    this.db = param.db
    this.doctorServiceRepository = param.doctorServiceRepository
    this.roomScheduleRepository = param.roomScheduleRepository
    this.doctorScheduleRepository = param.doctorScheduleRepository
    this.clinicScheduleRepository = param.clinicScheduleRepository
    this.appointmentRepository = param.appointmentRepository
  }


  createAppointment = createAppointmentService
  cancelAppointment = cancelAppointmentService
}