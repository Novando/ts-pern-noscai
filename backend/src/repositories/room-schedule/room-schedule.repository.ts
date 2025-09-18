import type {Pool} from "pg";
import {getAvailableRoomRepository} from "./get-available-room.repository";
import {
  getMultipleRoomBusinessHoursByServiceIdRepository
} from "./get-multiple-room-business-hours-by-service-id.repository.ts";


export class RoomScheduleRepository {
  constructor(
    protected readonly db: Pool
  ){}

  getAvailableRoom = getAvailableRoomRepository
  getMultipleRoomBusinessHoursByServiceId = getMultipleRoomBusinessHoursByServiceIdRepository
}