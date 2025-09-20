import Joi from 'joi';
import type {ServiceService} from "./service.service";

const schema = Joi.object({
  serviceId: Joi.number().min(1).required(),
  clinicId: Joi.number().min(1).required()
});

export async function getDoctorsByServiceIdAndClinicIdService(
  this: ServiceService,
  serviceId: number,
  clinicId: number
) {
  // Validate input

  await schema.validateAsync({ serviceId, clinicId });

  return this.serviceRepository.getDoctorsByServiceIdAndClinicId(serviceId, clinicId);
}
