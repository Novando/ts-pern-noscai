// src/services/patient.ts
import { api } from './api';
import {ApiResponse, ListResponse} from "@/src/types/clinic";

export interface Patient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export async function fetchPatients(): Promise<Patient[]> {
  try {
    const response = await api.get<ApiResponse<ListResponse<Patient>>>('/patients');
    return response.value.data || [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}