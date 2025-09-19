import { ScheduleService } from '../../../services/schedule/schedule.service';
import {getServiceAvailabilityHttpController} from "./get-service-availability.http.controller";
import {getDoctorBookedHttpController} from "./get-doctor-booked.http.controller";

export class ScheduleHttpController {
  constructor(
    protected readonly scheduleService: ScheduleService
  ) {}

  getServiceAvailability = getServiceAvailabilityHttpController
  getDoctorBooked = getDoctorBookedHttpController
}
