import { api } from './api';

interface BookAppointmentParams {
  serviceId: number;
  startsAt: string;
  patientId: number;
  doctorId: number;
}

export async function bookAppointment(params: BookAppointmentParams) {
  return api.post('/appointments', {
    body: {
      ...params
    }
  });
}
