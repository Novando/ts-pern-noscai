import type {AppointmentService} from "./appointment.service";
import {Logger} from "../../utils/logger.util";
import Joi from "joi";
import type {PostAppointmentDTOReq} from "../../models/dto/request/appointment.dto.request";
import {withTx} from "../../utils/pg-tx.util";
import dayjs from "dayjs";


const schema = Joi.object<PostAppointmentDTOReq>({
  doctorId: Joi.number().min(1).required(),
  patientId: Joi.number().min(1).required(),
  serviceId: Joi.number().min(1).required(),
  clinicId: Joi.number().min(1).required(),
  startsAt: Joi.date().required(),
})

export async function createAppointmentService(this: AppointmentService, param: PostAppointmentDTOReq) {
  try {
    const value = await schema.validateAsync(param)

    return await withTx(this.db, async (): Promise<{message: string}> => {
      // Make sure requested doctor is serving the service
      const doctorService = await this.doctorServiceRepository.getDurationBufferByDoctorIdServiceId(value.doctorId, value.serviceId)

      // prepare the booking data
      const duration = doctorService.duration + doctorService.buffer
      const statsAt = dayjs(value.startsAt)
      const endsAt = statsAt.add(duration, 'minutes')
      const day = statsAt.day()
      if (day !== dayjs(endsAt).day()) throw Error('Intraday not permitted')

      // Check clinic working hour
      await this.clinicScheduleRepository.checkWorkingHour({
        clinicId: param.clinicId,
        startsAt: statsAt.toDate(),
        endsAt: endsAt.toDate(),
        day: day,
      })

      // Check doctor working hour
      await this.doctorScheduleRepository.checkWorkingHour({
        doctorId: param.doctorId,
        startsAt: statsAt.toDate(),
        endsAt: endsAt.toDate(),
        day: day,
      })

      // Check room working hour
      const roomId = await this.roomScheduleRepository.getAvailableRoom({
        roomIds: doctorService.roomIds,
        startsAt: statsAt.toDate(),
        endsAt: endsAt.toDate(),
        day: day,
      })

      // Create appointment
      await this.appointmentRepository.createAppointment({
        doctorId: value.doctorId,
        patientId: value.patientId,
        roomId: roomId,
        startsAt: statsAt.toDate(),
        endsAt: endsAt.toDate(),
      })

      return {message: 'Appointment created'}
    })

  } catch (e) {
    Logger.error(e as Error)
    throw e
  }
}