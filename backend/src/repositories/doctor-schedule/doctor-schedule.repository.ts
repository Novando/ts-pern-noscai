import type {Pool} from "pg";
import {checkDoctorWorkingHourRepository} from "./check-doctor-working-hour.repository";
import {
  getMultipleDoctorBusinessHoursByServiceIdRepository
} from "./get-multiple-doctor-business-hours-by-service-id.repository";


export class DoctorScheduleRepository {
  constructor(
    protected readonly db: Pool
  ){}

  checkWorkingHour = checkDoctorWorkingHourRepository
  getMultipleDoctorBusinessHoursByServiceId = getMultipleDoctorBusinessHoursByServiceIdRepository
}