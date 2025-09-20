import { api } from './api';

export interface Doctor {
  id: number;
  name: string;
}

export async function fetchDoctorsByService(serviceId: number): Promise<Doctor[]> {
  const response = await api.get<{ value: {data: Doctor[]} }>(`/services/${serviceId}/doctors`);
  return response.value.data || [];
}
