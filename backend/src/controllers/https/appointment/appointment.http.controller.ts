import {postAppointmentHttpController} from "./post-appointment.http.controller";
import {deleteAppointmentHttpController} from "./delete-appointment.http.controller";
import type {AppointmentService} from "../../../services/appointment/appointment.service";

export class AppointmentHttpController {
  constructor(
    protected readonly appointmentService: AppointmentService
  ) {}

  postAppointment = postAppointmentHttpController;
  deleteAppointment = deleteAppointmentHttpController;
}