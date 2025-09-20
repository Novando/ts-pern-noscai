import {ServiceService} from "./service.service";
import Joi from "joi";


export async function getServiceByClinicIdService(this: ServiceService, clinicId: number) {
  const value = await Joi.number().min(1).required().validateAsync(clinicId)

  return await this.serviceRepository.getServicesByClinicId(value);
}