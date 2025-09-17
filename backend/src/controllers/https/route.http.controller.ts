import express from 'express';
import type {AppointmentHttpController} from "./appointment/appointment.http.controller";
import {guardMiddleware} from "../../middlewares/guard.middleware";

export class RouteHttpController {
  private readonly router: express.Router;

  constructor(
    private readonly appointmentController: AppointmentHttpController
  ) {
    this.router = express.Router();
    this.router.use(guardMiddleware)
    this.router.post('/appointments', appointmentController.postAppointment.bind(this.appointmentController)); // create booking
    this.router.delete('/appointments/:id'); // cancel booking
    this.router.get('/availability'); // search availability
    this.router.get('/doctors/:id/schedule'); // list doctor’s appointments for calendar view
  }

  getRouter(): express.Router {
    return this.router;
  }
}