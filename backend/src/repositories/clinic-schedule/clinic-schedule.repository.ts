import type {Pool} from "pg";
import {checkClinicBusinessHourRepository} from "./check-clinic-business-hour.repository";
import {getClinicBusinessHoursRepository} from "./get-clinic-business-hours.repository";


export class ClinicScheduleRepository{
  constructor(
    protected readonly db: Pool
  ){}

  checkWorkingHour = checkClinicBusinessHourRepository
  getClinicBusinessHours = getClinicBusinessHoursRepository
}