import { api } from './api';
import {Service} from "@/src/types/service";

export async function fetchServices(): Promise<Service[]> {
  try {
    const response = await api.get<{ value: {data: Service[]} }>('/services');
    return response.value.data || [];
  } catch (error) {
    throw new Error('Failed to load services. Please try again later.');
  }
}
