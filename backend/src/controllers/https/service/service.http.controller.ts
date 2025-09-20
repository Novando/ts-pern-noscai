import type {ServiceService} from "../../../services/service/service.service";
import {getServicesController} from "./get-services.http.controller";

export class ServiceHttpController {
  constructor(
    protected readonly serviceService: ServiceService
  ) {}

  getService = getServicesController
}
