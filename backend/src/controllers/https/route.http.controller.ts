import express from 'express';
import type {AppointmentHttpController} from "./appointment/appointment.http.controller";
import {guardMiddleware} from "../../middlewares/guard.middleware";
import type {ScheduleHttpController} from "./schedule/schedule.http.controller";
import type {ClinicHttpController} from "./clinic/clinic.http.controller";

export class RouteHttpController {
  private readonly router: express.Router;

  constructor(
    private readonly appointmentController: AppointmentHttpController,
    private readonly scheduleController: ScheduleHttpController,
    private readonly clinicController: ClinicHttpController
  ) {
    this.router = express.Router();
    this.router.get('/clinics', clinicController.getClinics.bind(this.clinicController))

    // TODO: use guardMiddleware for all routes specify after the declaration
    // this.router.use(guardMiddleware)
    this.router.post('/appointments', guardMiddleware, appointmentController.postAppointment.bind(this.appointmentController)); // create booking
    // this.router.delete('/appointments/:id'); // cancel booking
    this.router.get('/schedules/services/:id/availability', guardMiddleware, scheduleController.getServiceAvailability.bind(this.scheduleController)); // get service availability
    this.router.get('/schedules/doctors/:id/booked', guardMiddleware, scheduleController.getDoctorBooked.bind(this.scheduleController)); // list doctor’s appointments for calendar view
  }

  getRouter(): express.Router {
    return this.router;
  }
}