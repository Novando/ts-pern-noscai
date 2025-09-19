import { ApiResponse, Clinic, ListResponse } from '@/app/types/clinic';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchClinics(): Promise<ApiResponse<ListResponse<Clinic>>> {
  try {
    const response = await fetch(`${API_BASE_URL}/clinics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: ApiResponse<ListResponse<Clinic>> = await response.json();
    
    if (data.code !== 'SUCCESS') {
      throw new Error(data.message || 'Failed to fetch clinics');
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch clinics:', error);
    throw error;
  }
}
