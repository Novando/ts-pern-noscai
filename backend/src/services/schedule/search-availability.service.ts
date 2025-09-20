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

export async function searchAvailabilityService(
  this: ScheduleService,
  param: GetServiceAvailabilityDTOReq
): Promise<GetServiceAvailabilityDTORes[]> {
  const { clinicId, serviceId, selectedTime, doctorId } = await schema.validateAsync(param);
  const selectedDateTime = dayjs(selectedTime);

  return await withTx(this.db, async (): Promise<GetServiceAvailabilityDTORes[]> => {
    // Get all schedules and appointments in parallel
    const [clinicSchedules, doctorSchedules, roomSchedules, appointments] = await Promise.all([
      this.clinicScheduleRepository.getClinicBusinessHours(clinicId),
      this.doctorScheduleRepository.getMultipleDoctorBusinessHoursByServiceId(serviceId, clinicId, doctorId),
      this.roomScheduleRepository.getMultipleRoomBusinessHoursByServiceId(serviceId, clinicId),
      this.appointmentRepository.getAppointmentByServiceId(
        serviceId,
        clinicId,
        selectedTime,
        dayjs(selectedTime).add(7, 'days').toDate()
      )
    ]);

    // Group schedules by day and doctor
    const schedulesByDayAndDoctor = groupSchedulesByDayAndDoctor(
      clinicSchedules,
      doctorSchedules,
      roomSchedules
    );

    // Group appointments by day of week
    const appointmentsByDay = groupAppointmentsByDay(appointments);

    const availableSlots: GetServiceAvailabilityDTORes[] = [];
    let slotsFound = 0;
    const maxSlots = 3;

    // TODO: if no doctorId were specified, find the next 3 slot for each doctors
    // Check each day starting from the selected time
    for (let day = 0; day < 7 && slotsFound < maxSlots; day++) {
      const currentDate = selectedDateTime.add(day, 'days');
      const dayOfWeek = currentDate.day();
      const dayAppointments = appointmentsByDay[dayOfWeek] || [];

      // Get all doctor schedules for this day
      const dailySchedules = schedulesByDayAndDoctor[dayOfWeek] || [];

      for (const schedule of dailySchedules) {
        if (slotsFound >= maxSlots) break;

        const slots = calculateAvailableSlots(
          [schedule],
          dayAppointments,
          currentDate.toDate()
        );

        // Add doctor info to each time slot
        const slotsWithDoctor = slots.map(slot => ({
          ...slot,
          doctorId: schedule.doctorId,
          doctorName: schedule.doctorName
        }));

        // Add only the number of slots needed to reach maxSlots
        const slotsToAdd = slotsWithDoctor.slice(0, maxSlots - slotsFound);
        if (slotsToAdd.length > 0) {
          availableSlots.push({
            date: currentDate.toDate(),
            doctorId: schedule.doctorId,
            doctorName: schedule.doctorName,
            timeSlots: slotsToAdd
          });
          slotsFound += slotsToAdd.length;
        }
      }
    }

    return availableSlots;
  });
}

function groupSchedulesByDayAndDoctor(
  clinicSchedules: ScheduleEntity[],
  doctorSchedules: ScheduleEntity[],
  roomSchedules: ScheduleEntity[]
): { [key: number]: ScheduleEntity[] } {
  const schedulesByDay: { [key: number]: ScheduleEntity[] } = {};

  // First, group doctor schedules by day
  doctorSchedules.forEach(schedule => {
    const day = schedule.dayOfWeek;
    if (!schedulesByDay[day]) {
      schedulesByDay[day] = [];
    }

    // Find matching clinic schedule
    const clinicSchedule = clinicSchedules.find(cs => cs.dayOfWeek === day);
    if (!clinicSchedule) return; // Skip if clinic is closed

    // Find matching room schedule
    const roomSchedule = roomSchedules.find(rs => rs.dayOfWeek === day);
    if (!roomSchedule) return; // Skip if room is not available

    // Calculate intersection of all schedules
    const start = Math.max(
      schedule.startsAt.getTime(),
      clinicSchedule.startsAt.getTime(),
      roomSchedule.startsAt.getTime()
    );

    const end = Math.min(
      schedule.endsAt.getTime(),
      clinicSchedule.endsAt.getTime(),
      roomSchedule.endsAt.getTime()
    );

    if (start >= end) return; // No overlapping time

    // Create a new schedule with the intersection
    const availableSchedule = {
      ...schedule,
      startsAt: new Date(start),
      endsAt: new Date(end),
      // Combine breaks from all schedules
      breaks: [...(schedule.breaks || []), ...(clinicSchedule.breaks || []), ...(roomSchedule.breaks || [])]
    };

    schedulesByDay[day].push(availableSchedule);
  });

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
  selectedDate: Date
): TimeSlotDTORes[] {
  const slots: TimeSlotDTORes[] = [];
  const selectedTime = dayjs(selectedDate);

  schedules.forEach(schedule => {
    let currentSlotStart = dayjs(schedule.startsAt);
    const dayEnd = dayjs(schedule.endsAt);

    // If the schedule is for today and we're past the start time, start from now
    if (selectedTime.isSame(currentSlotStart, 'day') && selectedTime.isAfter(currentSlotStart)) {
      currentSlotStart = selectedTime;
    }

    // Generate time slots considering breaks
    while (currentSlotStart.add(30, 'minutes').isBefore(dayEnd) ||
    currentSlotStart.add(30, 'minutes').isSame(dayEnd)) {
      const slotEnd = currentSlotStart.add(30, 'minutes');

      // Check if this time slot is during a break
      const isDuringBreak = schedule.breaks?.some(brk => {
        const breakStart = dayjs(brk.startsAt);
        const breakEnd = dayjs(brk.endsAt);
        return (
          (currentSlotStart.isAfter(breakStart) && currentSlotStart.isBefore(breakEnd)) ||
          (slotEnd.isAfter(breakStart) && slotEnd.isBefore(breakEnd)) ||
          ((currentSlotStart.isSame(breakStart) || currentSlotStart.isBefore(breakStart)) &&
          (slotEnd.isSame(breakEnd) || slotEnd.isAfter(breakEnd)))
        );
      });

      // Check if this time slot is booked
      const isBooked = appointments.some(apt => {
        const aptStart = dayjs(apt.timeRange.start);
        const aptEnd = dayjs(apt.timeRange.end);
        return (
          (currentSlotStart.isAfter(aptStart) && currentSlotStart.isBefore(aptEnd)) ||
          (slotEnd.isAfter(aptStart) && slotEnd.isBefore(aptEnd)) ||
          ((currentSlotStart.isSame(aptStart) || currentSlotStart.isBefore(aptStart)) &&
          (slotEnd.isSame(aptEnd) || slotEnd.isAfter(aptEnd)))
        );
      });

      if (!isDuringBreak && !isBooked) {
        slots.push({
          starts: currentSlotStart.toDate(),
          ends: slotEnd.toDate(),
          doctorName: schedule.doctorName,
        });
      }

      currentSlotStart = slotEnd;
    }
  });

  return slots;
}