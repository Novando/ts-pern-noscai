import { ApiResponse, ListResponse } from '@/src/types/clinic';
import { api } from './api';

export interface Clinic {
  id: number;
  name: string;
}

export async function fetchClinics(): Promise<ApiResponse<ListResponse<Clinic>>> {
  try {
    return api.get<ApiResponse<ListResponse<Clinic>>>('/clinics');
  } catch (error) {
    throw error;
  }
}