import type {Pool} from "pg";
import {checkDoctorWorkingHourRepository} from "./check-doctor-working-hour.repository";


export class DoctorScheduleRepository {
  constructor(
    protected readonly db: Pool
  ){}

  checkWorkingHour = checkDoctorWorkingHourRepository
}