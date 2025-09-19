import type {ClinicRepository} from "./clinic.repository";
import {clinicQueryGetClinics} from "./clinic-query.repository";

export async function getClinicsRepository(this: ClinicRepository) {
  const result = await this.db.query(clinicQueryGetClinics);
  if (result.rows.length < 1) throw Error('Clinic not found')

  return result.rows.map((item) => ({
    id: item.id,
    name: item.name,
  }))
}