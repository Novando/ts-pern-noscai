import type {ClinicRepository} from "./clinic.repository";
import {clinicQueryGetClinics} from "./clinic-query.repository";
import {AppError} from "../../utils/error.util";
import {constants} from "http2";

export async function getClinicsRepository(this: ClinicRepository) {
  const result = await this.db.query(clinicQueryGetClinics);
  if (result.rows.length < 1) throw new AppError('Clinic not found', 'NOT_FOUND', constants.HTTP_STATUS_NOT_FOUND)

  return result.rows.map((item) => ({
    id: item.id,
    name: item.name,
  }))
}