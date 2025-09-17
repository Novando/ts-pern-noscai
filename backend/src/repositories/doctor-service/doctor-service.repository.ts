import type { Pool } from "pg";
import {getDurationBufferByDoctorIdServiceIdRepository} from "./get-duration-buffer-by-doctor-id-service-id.repository";


export class DoctorServiceRepository {
  constructor(protected readonly db: Pool) {}

  getDurationBufferByDoctorIdServiceId = getDurationBufferByDoctorIdServiceIdRepository
}