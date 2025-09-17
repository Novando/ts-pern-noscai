import type {Pool} from "pg";
import {getAvailableRoomRepository} from "./get-available-room.repository";


export class RoomScheduleRepository {
  constructor(
    protected readonly db: Pool
  ){}

  getAvailableRoom = getAvailableRoomRepository
}