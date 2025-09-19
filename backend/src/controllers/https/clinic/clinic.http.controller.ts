import {getClinicsHttpController} from "./get-clinics.http.controller";
import type {ClinicService} from "../../../services/clinic/clinic.service";


export class ClinicHttpController {
  constructor(
    protected readonly clinicService: ClinicService
  ) {}

  getClinics = getClinicsHttpController
}