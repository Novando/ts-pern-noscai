import {ApiResponse, ListResponse} from './clinic';

export interface TimeSlot {
  starts: string;
  ends: string;
}

export interface AvailabilityResponse {
  doctorName: number;
  doctorId: number;
  date: string;
  timeSlots: TimeSlot[];
}

export type AvailabilityApiResponse = ApiResponse<ListResponse<AvailabilityResponse>>;
