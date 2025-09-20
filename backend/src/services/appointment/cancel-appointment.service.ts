import Joi from 'joi';
import type {AppointmentService} from "./appointment.service";

const schema = Joi.object({
  appointmentId: Joi.number().min(1).required(),
  clinicId: Joi.number().min(1).required()
});

export async function cancelAppointmentService(
  this: AppointmentService,
  appointmentId: number,
  clinicId: number
) {
  // Validate input
  await schema.validateAsync({ appointmentId, clinicId });

  // Attempt to cancel the appointment
  const deletedCount = await this.appointmentRepository.cancelAppointment(appointmentId, clinicId);

  if (deletedCount === 0) throw new Error('Appointment not found or does not belong to this clinic');

  return;
}
