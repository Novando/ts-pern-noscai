import { AvailabilityApiResponse } from '@/app/types/schedule';
import { api } from './api';

export interface ServiceAvailabilityParams {
  serviceId: number;
  selectedTime?: Date;
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