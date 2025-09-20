import { AvailabilityApiResponse } from '@/src/types/schedule';
import { api } from './api';
import {ListResponse} from "@/src/types/clinic";

export interface ServiceAvailabilityParams {
  serviceId: number;
  selectedTime?: Date;
  doctorId?: number;
}

export async function fetchServiceAvailability(
  params: ServiceAvailabilityParams
): Promise<AvailabilityApiResponse> {
  const { serviceId, selectedTime } = params;
  
  try {
    const response = await api.get<AvailabilityApiResponse>(
      `/schedules/services/${serviceId}/availability`,
      {
        params: selectedTime ? { selectedTime: selectedTime.toISOString() } : undefined,
      }
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch service availability:', error);
    throw error;
  }
}