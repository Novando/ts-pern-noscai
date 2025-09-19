import express from "express";
import {RouteHttpController} from "../controllers/https/route.http.controller";
import { initPg } from "../libs/pg.lib";
import { DoctorServiceRepository } from "../repositories/doctor-service/doctor-service.repository";
import {AppointmentRepository} from "../repositories/appointment/appointment.repository";
import {ClinicScheduleRepository} from "../repositories/clinic-schedule/clinic-schedule.repository";
import {DoctorScheduleRepository} from "../repositories/doctor-schedule/doctor-schedule.repository";
import {RoomScheduleRepository} from "../repositories/room-schedule/room-schedule.repository";
import {ScheduleService} from "../services/schedule/schedule.service";
import {AppointmentService} from "../services/appointment/appointment.service";
import {ScheduleHttpController} from "../controllers/https/schedule/schedule.http.controller";
import {AppointmentHttpController} from "../controllers/https/appointment/appointment.http.controller";
import {ClinicHttpController} from "../controllers/https/clinic/clinic.http.controller";
import {ClinicService} from "../services/clinic/clinic.service";
import {ClinicRepository} from "../repositories/clinic/clinic.repository";

export async function startRest(): Promise<express.Router> {
  const pg = await initPg()

  // Repository
  const clinicScheduleRepo = new ClinicScheduleRepository(pg)
  const doctorScheduleRepo = new DoctorScheduleRepository(pg)
  const roomScheduleRepo = new RoomScheduleRepository(pg)
  const appointmentRepo = new AppointmentRepository(pg)
  const doctorServiceRepo = new DoctorServiceRepository(pg)
  const clinicRepo = new ClinicRepository(pg)

  // Service
  const scheduleSvc = new ScheduleService({
    db: pg,
    clinicScheduleRepository: clinicScheduleRepo,
    doctorScheduleRepository: doctorScheduleRepo,
    roomScheduleRepository: roomScheduleRepo,
    appointmentRepository: appointmentRepo,
  })
  const appointmentSvc = new AppointmentService({
    db: pg,
    doctorServiceRepository: doctorServiceRepo,
    appointmentRepository: appointmentRepo,
    roomScheduleRepository: roomScheduleRepo,
    doctorScheduleRepository: doctorScheduleRepo,
    clinicScheduleRepository: clinicScheduleRepo,
  })
  const clinicSvc = new ClinicService(clinicRepo)

  // Controller
  const schedulerCtrl = new ScheduleHttpController(scheduleSvc)
  const appointmentCtrl = new AppointmentHttpController(appointmentSvc)
  const clinicCtrl = new ClinicHttpController(clinicSvc)

  const router = new RouteHttpController({
    appointmentController: appointmentCtrl,
    scheduleController: schedulerCtrl,
    clinicController: clinicCtrl,
  })

  return router.getRouter();
}