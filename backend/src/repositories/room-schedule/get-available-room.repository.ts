import type {RoomScheduleRepository} from "./room-schedule.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {roomScheduleQueryCheckWorkingHour} from "./room-schedule-query.repository";
import type {RoomScheduleCheckWorkingHourParam} from "../../models/entity/room-schedule.entity";


export async function getAvailableRoomRepository(this: RoomScheduleRepository, param: RoomScheduleCheckWorkingHourParam) {
  const db = getAsyncLocalStorage('pgTx') ?? this.db;

  const res = await db.query(
    roomScheduleQueryCheckWorkingHour,
    [param.roomIds, param.day, param.startsAt, param.endsAt],
  )
  if (res.rows.length < 1) throw Error('All rooms unavailable')

  return res.rows[0]['id'] as number
}