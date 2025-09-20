import type {PatientRepository} from "./patient.repository";
import type {PatientEntity} from "../../models/entity/patient.entity";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {patientQueryGetPatientsByClinicId} from "./patient-query.repository";
import {Logger} from "../../utils/logger.util";


export async function getPatientByClinicIdRepository(this: PatientRepository, id: number): Promise<PatientEntity[]> {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.pool;

    const res = await db.query<PatientEntity>(patientQueryGetPatientsByClinicId, [id]);

    return res.rows
  } catch (e) {
    Logger.error('getPatientByClinicIdRepository', (e as Error))
    throw e
  }
}