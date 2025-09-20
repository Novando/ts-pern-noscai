import express from 'express';
import type {AppointmentHttpController} from "./appointment/appointment.http.controller";
import {guardMiddleware} from "../../middlewares/guard.middleware";
import type {ScheduleHttpController} from "./schedule/schedule.http.controller";
import type {ClinicHttpController} from "./clinic/clinic.http.controller";
import type {ServiceHttpController} from "./service/service.http.controller";

type Constructor = {
  appointmentController: AppointmentHttpController
  scheduleController: ScheduleHttpController
  clinicController: ClinicHttpController
  serviceController: ServiceHttpController
}

export class RouteHttpController {
  private readonly router: express.Router;

  constructor(private readonly param: Constructor) {
    this.router = express.Router();
    this.router.get('/clinics', param.clinicController.getClinics.bind(this.param.clinicController))

    // TODO: use guardMiddleware for all routes specify after the declaration
    // this.router.use(guardMiddleware)
    this.router.post('/appointments', guardMiddleware, param.appointmentController.postAppointment.bind(this.param.appointmentController)); // create booking
    this.router.delete('/appointments/:id', guardMiddleware, param.appointmentController.deleteAppointment.bind(this.param.appointmentController));
    this.router.get('/services', guardMiddleware, param.serviceController.getService)
    this.router.get('/schedules/services/:id/availability', guardMiddleware, param.scheduleController.getServiceAvailability.bind(this.param.scheduleController)); // get service availability
    this.router.get('/schedules/doctors/:id/booked', guardMiddleware, param.scheduleController.getDoctorBooked.bind(this.param.scheduleController)); // list doctor’s appointments for calendar view
  }

  getRouter(): express.Router {
    return this.router;
  }
}