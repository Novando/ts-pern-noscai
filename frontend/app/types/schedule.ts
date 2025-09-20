import { ApiResponse } from './clinic';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface AvailabilityResponse {
  serviceId: number;
  clinicId: number;
  date: string;
  timeSlots: TimeSlot[];
}

export type AvailabilityApiResponse = ApiResponse<AvailabilityResponse>;
