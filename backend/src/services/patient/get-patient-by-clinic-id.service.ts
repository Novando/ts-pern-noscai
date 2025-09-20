import type {PatientService} from "./patient.service";
import Joi from "joi";

export async function getPatientsByClinicIdService(this: PatientService, id: number) {
  await Joi.number().min(1).required().validateAsync(id)
  return this.patientRepository.getPatientByClinicId(id);
}