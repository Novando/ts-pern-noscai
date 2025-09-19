import type {ClinicService} from "./clinic.service";


export async function getClinicsService(this: ClinicService) {
  return await this.clinicRepository.getClinics();
}