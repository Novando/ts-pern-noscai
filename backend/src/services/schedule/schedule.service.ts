import {searchAvailabilityService} from "./search-availability.service";
import {doctorBookedSchedulesService} from "./doctor-booked-schedules.service";
import type {ClinicScheduleRepository} from "../../repositories/clinic-schedule/clinic-schedule.repository";
import type {DoctorScheduleRepository} from "../../repositories/doctor-schedule/doctor-schedule.repository";
import type {RoomScheduleRepository} from "../../repositories/room-schedule/room-schedule.repository";
import type {AppointmentRepository} from "../../repositories/appointment/appointment.repository";
import type {Pool} from "pg";


type Constructor = {
  db: Pool
  clinicScheduleRepository: ClinicScheduleRepository
  doctorScheduleRepository: DoctorScheduleRepository
  roomScheduleRepository: RoomScheduleRepository
  appointmentRepository: AppointmentRepository
};

export class ScheduleService {
  protected readonly db: Pool
  protected readonly clinicScheduleRepository: ClinicScheduleRepository
  protected readonly doctorScheduleRepository: DoctorScheduleRepository
  protected readonly roomScheduleRepository: RoomScheduleRepository
  protected readonly appointmentRepository: AppointmentRepository

  constructor(
    param: Constructor
  ) {
    this.db = param.db
    this.clinicScheduleRepository = param.clinicScheduleRepository
    this.doctorScheduleRepository = param.doctorScheduleRepository
    this.roomScheduleRepository = param.roomScheduleRepository
    this.appointmentRepository = param.appointmentRepository
  }

  searchAvailability = searchAvailabilityService
  doctorBookedSchedule = doctorBookedSchedulesService
}
