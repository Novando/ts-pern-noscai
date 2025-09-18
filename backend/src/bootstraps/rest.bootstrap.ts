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

export async function startRest(): Promise<express.Router> {
  const pg = await initPg()

  // Repository
  const clinicScheduleRepo = new ClinicScheduleRepository(pg)
  const doctorScheduleRepo = new DoctorScheduleRepository(pg)
  const roomScheduleRepo = new RoomScheduleRepository(pg)
  const appointmentRepo = new AppointmentRepository(pg)
  const doctorServiceRepo = new DoctorServiceRepository(pg)

  // Service
  const scheduleSvc = new ScheduleService(pg, clinicScheduleRepo, doctorScheduleRepo, roomScheduleRepo, appointmentRepo)
  const appointmentSvc = new AppointmentService(pg, doctorServiceRepo, roomScheduleRepo, doctorScheduleRepo, clinicScheduleRepo, appointmentRepo)

  // Controller
  const schedulerCtrl = new ScheduleHttpController(scheduleSvc)
  const appointmentCtrl = new AppointmentHttpController(appointmentSvc)

  const router = new RouteHttpController(appointmentCtrl, schedulerCtrl)

  return router.getRouter();
}