import type {GetServiceAvailabilityDTOReq} from "../../models/dto/request/schedule.dto.request";
import type {GetServiceAvailabilityDTORes, TimeSlotDTORes} from "../../models/dto/response/schedule.dto.response"
import type {ScheduleService} from "./schedule.service";
import {withTx} from "../../utils/pg-tx.util";
import Joi from "joi";
import type {ScheduleEntity} from "../../models/entity/common.entity";
import type {GetAppointmentsByServiceIdEntity} from "../../models/entity/appointment.entity";
import dayjs from "dayjs";
import {Logger} from "../../utils/logger.util";

const schema = Joi.object<GetServiceAvailabilityDTOReq>({
  clinicId: Joi.number().min(1).required(),
  serviceId: Joi.number().min(1).required(),
  doctorId: Joi.number().min(1).optional(),
  selectedTime: Joi.date().required(),
})

export async function searchAvailabilityService(this: ScheduleService, param: GetServiceAvailabilityDTOReq): Promise<GetServiceAvailabilityDTORes[]> {
  const {clinicId, serviceId, selectedTime, doctorId} = await schema.validateAsync(param)

  return await withTx(this.db, async (): Promise<GetServiceAvailabilityDTORes[]> => {
    const res: GetServiceAvailabilityDTORes[] = []

    // Get all schedules and appointments in parallel
    const [clinicSchedules, doctorSchedules, roomSchedules, appointments] = await Promise.all([
      this.clinicScheduleRepository.getClinicBusinessHours(clinicId),
      this.doctorScheduleRepository.getMultipleDoctorBusinessHoursByServiceId(serviceId, clinicId, doctorId),
      this.roomScheduleRepository.getMultipleRoomBusinessHoursByServiceId(serviceId, clinicId),
      this.appointmentRepository.getAppointmentByServiceId(serviceId, clinicId, selectedTime, dayjs(param.selectedTime).add(7, 'days').toDate())
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
        date: dayjs(selectedTime).add(day, 'days').toDate(),
        timeSlots: calculateAvailableSlots(daySchedules, dayAppointments)
      })
    }

    return res
  })
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

  // Process each schedule separately to maintain doctor information
  const allSlots: TimeSlotDTORes[] = [];

  for (const schedule of schedules) {
    // Initialize available slots with the schedule's time range
    let availableSlots: TimeSlotDTORes[] = [{
      starts: schedule.startsAt,
      ends: schedule.endsAt,
      doctorName: schedule.doctorName || ''
    }];

    // Process breaks for this schedule
    if (schedule.breaks) {
      for (const brk of schedule.breaks) {
        const newSlots: TimeSlotDTORes[] = [];
        for (const slot of availableSlots) {
          // If the break doesn't overlap with this slot, keep it as is
          if (brk.endsAt <= slot.starts || brk.startsAt >= slot.ends) {
            newSlots.push(slot);
            continue;
          }

          // If the break completely covers this slot, remove it
          if (brk.startsAt <= slot.starts && brk.endsAt >= slot.ends) {
            continue;
          }

          // If the break is in the middle, split the slot
          if (brk.startsAt > slot.starts) {
            newSlots.push({
              starts: slot.starts,
              ends: brk.startsAt,
              doctorName: slot.doctorName
            });
          }
          if (brk.endsAt < slot.ends) {
            newSlots.push({
              starts: brk.endsAt,
              ends: slot.ends,
              doctorName: slot.doctorName
            });
          }
        }
        availableSlots = newSlots;
      }
    }

    // Process appointments for this doctor
    const doctorAppointments = appointments
      .filter(a => a.doctorId === schedule.doctorId)
      .sort((a, b) => a.timeRange.start.valueOf() - b.timeRange.start.valueOf());

    for (const appt of doctorAppointments) {
      const newSlots: TimeSlotDTORes[] = [];
      for (const slot of availableSlots) {
        // If the appointment doesn't overlap with this slot, keep it as is
        if (appt.timeRange.end <= slot.starts || appt.timeRange.start >= slot.ends) {
          newSlots.push(slot);
          continue;
        }

        // If the appointment completely covers this slot, remove it
        if (appt.timeRange.start <= slot.starts && appt.timeRange.end >= slot.ends) {
          continue;
        }

        // If the appointment is in the middle, split the slot
        if (appt.timeRange.start > slot.starts) {
          newSlots.push({
            starts: slot.starts,
            ends: appt.timeRange.start,
            doctorName: slot.doctorName
          });
        }
        if (appt.timeRange.end < slot.ends) {
          newSlots.push({
            starts: appt.timeRange.end,
            ends: slot.ends,
            doctorName: slot.doctorName
          });
        }
      }
      availableSlots = newSlots;
    }

    allSlots.push(...availableSlots);
  }

  // Sort all slots by start time
  return allSlots.sort((a, b) => a.starts.valueOf() - b.starts.valueOf());
}