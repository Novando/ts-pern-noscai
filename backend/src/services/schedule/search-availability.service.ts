import type {GetServiceAvailabilityDTOReq} from "../../models/dto/request/schedule.dto.request";
import type {GetServiceAvailabilityDTORes, TimeSlotDTORes} from "../../models/dto/response/schedule.dto.response"
import type {ScheduleService} from "./schedule.service";
import {withTx} from "../../utils/pg-tx.util";
import Joi from "joi";
import type {ScheduleEntity} from "../../models/entity/common.entity";
import type {GetAppointmentsByServiceIdEntity} from "../../models/entity/appointment.entity";
import {Logger} from "../../utils/logger.util";
import dayjs from "dayjs";

const schema = Joi.object<GetServiceAvailabilityDTOReq>({
  clinicId: Joi.number().min(1).required(),
  serviceId: Joi.number().min(1).required(),
  startDate: Joi.date().required(),
})

export async function searchAvailabilityService(this: ScheduleService, param: GetServiceAvailabilityDTOReq): Promise<GetServiceAvailabilityDTORes[]> {
  try {
    await schema.validateAsync(param)

    return await withTx(this.db, async (): Promise<GetServiceAvailabilityDTORes[]> => {
      const res: GetServiceAvailabilityDTORes[] = []

      // Get all schedules and appointments in parallel
      const [clinicSchedules, doctorSchedules, roomSchedules, appointments] = await Promise.all([
        this.clinicScheduleRepository.getClinicBusinessHours(param.clinicId),
        this.doctorScheduleRepository.getMultipleDoctorBusinessHoursByServiceId(param.serviceId),
        this.roomScheduleRepository.getMultipleRoomBusinessHoursByServiceId(param.serviceId),
        this.appointmentRepository.getAppointmentByServiceId(param.serviceId, param.startDate, dayjs(param.startDate).add(7, 'days').toDate())
      ]);

      // Group schedules by day of week
      const schedulesByDay = groupSchedulesByDay(
        clinicSchedules,
        doctorSchedules.flat(),
        roomSchedules
      );

      // Group appointments by day of week
      const appointmentsByDay = groupAppointmentsByDay(appointments);

      // Calculate available time slots for each day
      for (let day = 0; day < 7; day++) {
        const daySchedules = schedulesByDay[day] || [];
        const dayAppointments = appointmentsByDay[day] || [];
        res.push({
          date: dayjs(param.startDate).add(day, 'days').toDate(),
          timeSlots: calculateAvailableSlots(daySchedules, dayAppointments)
        })
      }

      return res
    })
  } catch (e) {
    Logger.error(e as Error)
    throw e
  }
}

function groupSchedulesByDay(
  clinicSchedules: ScheduleEntity[],
  doctorSchedules: ScheduleEntity[],
  roomSchedules: ScheduleEntity[]
): { [key: number]: ScheduleEntity[] } {
  const schedulesByDay: { [key: number]: ScheduleEntity[] } = {};

  // Helper function to add schedules to the day
  const addSchedules = (schedules: ScheduleEntity[]) => {
    for (const schedule of schedules) {
      const day = schedule.dayOfWeek;
      if (!schedulesByDay[day]) {
        schedulesByDay[day] = [];
      }
      schedulesByDay[day].push(schedule);
    }
  };

  addSchedules(clinicSchedules);
  addSchedules(doctorSchedules);
  addSchedules(roomSchedules);

  return schedulesByDay;
}

function groupAppointmentsByDay(appointments: GetAppointmentsByServiceIdEntity[]): { [key: number]: GetAppointmentsByServiceIdEntity[] } {
  const appointmentsByDay: { [key: number]: GetAppointmentsByServiceIdEntity[] } = {};

  for (const appointment of appointments) {
    const date = appointment.timeRange.start;
    const day = dayjs(date).day();

    if (!appointmentsByDay[day]) {
      appointmentsByDay[day] = [];
    }
    appointmentsByDay[day].push(appointment);
  }

  return appointmentsByDay;
}

function calculateAvailableSlots(
  schedules: ScheduleEntity[],
  appointments: GetAppointmentsByServiceIdEntity[],
): TimeSlotDTORes[] {
  if (schedules.length === 0) return []

  // Find the common time range from all schedules (assuming all schedules are for the same day)
  const daySchedule = schedules[0] as ScheduleEntity; // Since we're grouping by day, we can take the first schedule

  // Initialize available slots with the full day schedule
  const availableSlots: TimeSlotDTORes[] = [{
    starts: daySchedule.startsAt,
    ends: daySchedule.endsAt
  }];

  // Process breaks from all schedules
  const allBreaks = schedules.flatMap(schedule =>
    schedule.breaks?.map(brk => ({
      starts: brk.startsAt,
      ends: brk.endsAt
    })) || []
  );

  // Process appointments
  const appointmentSlots = appointments.map(appt => ({
    starts: appt.timeRange.start,
    ends: appt.timeRange.end
  }));

  // Combine breaks and appointments
  const blockedSlots = [...allBreaks, ...appointmentSlots]
    .sort((a, b) => a.starts.valueOf() - b.starts.valueOf());

  // Split available slots based on blocked times
  for (const blocked of blockedSlots) {
    const newSlots: TimeSlotDTORes[] = [];

    for (const slot of availableSlots) {
      // If the blocked time doesn't overlap with this slot, keep it as is
      if (blocked.ends <= slot.starts || blocked.starts >= slot.ends) {
        newSlots.push(slot);
        continue;
      }

      // If the blocked time completely covers this slot, remove it
      if (blocked.starts <= slot.starts && blocked.ends >= slot.ends) {
        continue;
      }

      // If the blocked time is in the middle, split the slot
      if (blocked.starts > slot.starts) {
        newSlots.push({
          starts: slot.starts,
          ends: blocked.starts
        });
      }

      if (blocked.ends < slot.ends) {
        newSlots.push({
          starts: blocked.ends,
          ends: slot.ends
        });
      }
    }

    availableSlots.length = 0;
    availableSlots.push(...newSlots);
  }

  return availableSlots
    .filter(slot => dayjs(slot.starts).isBefore(slot.ends)) // Remove any invalid slots
    .sort((a, b) => a.starts.valueOf() - b.starts.valueOf()) // Sort by start time
}