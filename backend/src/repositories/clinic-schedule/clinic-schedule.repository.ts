import type {Pool} from "pg";
import {checkClinicWorkingHourRepository} from "./check-clinic-working-hour.repository";


export class ClinicScheduleRepository{
  constructor(
    protected readonly db: Pool
  ){}

  checkWorkingHour = checkClinicWorkingHourRepository
}