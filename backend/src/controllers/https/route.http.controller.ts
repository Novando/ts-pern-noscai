import express from 'express';
import type {AppointmentHttpController} from "./appointment/appointment.http.controller";
import {guardMiddleware} from "../../middlewares/guard.middleware";
import type {ScheduleHttpController} from "./schedule/schedule.http.controller";
import type {ClinicHttpController} from "./clinic/clinic.http.controller";
import type {ServiceHttpController} from "./service/service.http.controller";
import type {PatientHttpController} from "./patient/patient.http.controller";

type Constructor = {
  appointmentController: AppointmentHttpController
  scheduleController: ScheduleHttpController
  clinicController: ClinicHttpController
  serviceController: ServiceHttpController
  patientController: PatientHttpController
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
    this.router.get('/schedules/services/:id/availability', guardMiddleware, param.scheduleController.getServiceAvailability.bind(this.param.scheduleController)); // get service availability
    this.router.get('/schedules/doctors/:id/booked', guardMiddleware, param.scheduleController.getDoctorBooked.bind(this.param.scheduleController)); // list doctor’s appointments for calendar view
    this.router.get('/services', guardMiddleware, param.serviceController.getServices.bind(this.param.serviceController))
    this.router.get('/services/:id/doctors', guardMiddleware, param.serviceController.getDoctors.bind(this.param.serviceController))
    this.router.get('/patients', guardMiddleware, param.patientController.getPatients.bind(this.param.patientController))
  }

  getRouter(): express.Router {
    return this.router;
  }
}