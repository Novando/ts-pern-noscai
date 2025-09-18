import {searchAvailabilityService} from "./search-availability.service";
import type {ClinicScheduleRepository} from "../../repositories/clinic-schedule/clinic-schedule.repository";
import type {DoctorScheduleRepository} from "../../repositories/doctor-schedule/doctor-schedule.repository";
import type {RoomScheduleRepository} from "../../repositories/room-schedule/room-schedule.repository";
import type {AppointmentRepository} from "../../repositories/appointment/appointment.repository";
import type {Pool} from "pg";


type Appointment = {
  doctorId: number;
  roomId: number;
  timeRange: { start: Date; end: Date };
};

export class ScheduleService {
  constructor(
    protected readonly db: Pool,

    protected readonly clinicScheduleRepository: ClinicScheduleRepository,
    protected readonly doctorScheduleRepository: DoctorScheduleRepository,
    protected readonly roomScheduleRepository: RoomScheduleRepository,
    protected readonly appointmentRepository: AppointmentRepository,
  ) {}

  searchAvailability = searchAvailabilityService
}
