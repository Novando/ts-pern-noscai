import type {ServiceService} from "../../../services/service/service.service";
import {getServicesController} from "./get-services.http.controller";
import {getDoctorsController} from "./get-doctors.http.controller";

export class ServiceHttpController {
  constructor(
    protected readonly serviceService: ServiceService
  ) {}

  getServices = getServicesController
  getDoctors = getDoctorsController
}
