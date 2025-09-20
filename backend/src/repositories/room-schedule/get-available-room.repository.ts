import type {RoomScheduleRepository} from "./room-schedule.repository";
import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import {roomScheduleQueryCheckWorkingHour} from "./room-schedule-query.repository";
import type {RoomScheduleCheckWorkingHourParam} from "../../models/entity/room-schedule.entity";
import {Logger} from "../../utils/logger.util";
import {AppError} from "../../utils/error.util";
import {constants} from "http2";


export async function getAvailableRoomRepository(this: RoomScheduleRepository, param: RoomScheduleCheckWorkingHourParam) {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.db;

    const res = await db.query(
      roomScheduleQueryCheckWorkingHour,
      [param.roomIds, param.day, param.startsAt, param.endsAt],
    )
    if (res.rows.length < 1) throw new AppError('All rooms unavailable', 'NOT_AVAILABLE', constants.HTTP_STATUS_NOT_FOUND)

    return res.rows[0]['id'] as number
  } catch (e) {
    Logger.error('getAvailableRoomRepository', (e as Error).message)
    if (!(e instanceof AppError)) throw new AppError((e as Error).message)
    throw e
  }
}