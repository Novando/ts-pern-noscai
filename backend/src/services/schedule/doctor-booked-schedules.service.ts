import Joi from 'joi';
import type {ScheduleService} from "./schedule.service";
import type {BookedAppointmentDTORes} from "../../models/dto/response/doctor-schedule.dto.response";
import type {GetDoctorBookedScheduleDTOReq} from "../../models/dto/request/doctor-schedule.dto.request";

const schema = Joi.object({
  doctorId: Joi.number().min(1).required(),
  clinicId: Joi.number().min(1).required(),
  from: Joi.date().required(),
  to: Joi.date().min(Joi.ref('from')).required(),
})

export async function doctorBookedSchedulesService(
  this: ScheduleService,
  params: GetDoctorBookedScheduleDTOReq,
): Promise<BookedAppointmentDTORes[]> {
  // Validate input
  const { doctorId, clinicId, from, to } = await schema.validateAsync(params);

  // Get booked appointments from repository
  return this.appointmentRepository.getDoctorBookedAppointments(doctorId, clinicId, from, to);
}
