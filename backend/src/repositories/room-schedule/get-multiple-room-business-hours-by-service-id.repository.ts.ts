import {getAsyncLocalStorage} from "../../utils/local-storage.util";
import type {ScheduleEntity} from "../../models/entity/common.entity";
import type {RoomScheduleRepository} from "./room-schedule.repository";
import {roomScheduleQueryGetMultipleRoomBusinessHoursByServiceId} from "./room-schedule-query.repository";
import { normalizeIsoDate } from "../../utils/time.util";
import {Logger} from "../../utils/logger.util";


export async function getMultipleRoomBusinessHoursByServiceIdRepository(this: RoomScheduleRepository, serviceId: number, clinicId: number): Promise<ScheduleEntity[]> {
  try {
    const db = getAsyncLocalStorage('pgTx') ?? this.db;
    const res = await db.query(
      roomScheduleQueryGetMultipleRoomBusinessHoursByServiceId,
      [serviceId, clinicId],
    )
    if (res.rows.length < 1) throw Error('Room schedule unavailable')

    return res.rows.map<ScheduleEntity>((item) => ({
      dayOfWeek: item.day_of_week,
      startsAt: new Date(normalizeIsoDate(`1970-01-01T${item.starts_at}`)),
      endsAt: new Date(normalizeIsoDate(`1970-01-01T${item.ends_at}`)),
      breaks: item.breaks.map((breakItem: {starts_at: string, ends_at: string}) => ({
        startsAt: new Date(normalizeIsoDate(`1970-01-01T${breakItem.starts_at}`)),
        endsAt: new Date(normalizeIsoDate(`1970-01-01T${breakItem.ends_at}`)),
      }))
    }))
  } catch (e) {
    Logger.error('getMultipleRoomBusinessHoursByServiceIdRepository', e)
    throw e
  }
}