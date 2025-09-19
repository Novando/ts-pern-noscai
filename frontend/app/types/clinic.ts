export interface Clinic {
  id: number;
  name: string;
  // Add other clinic properties as needed from the database
}

export interface ApiResponse<T> {
  code: string;
  message: string;
  value: T;
}

export interface ListResponse<T> {
  data: T[];
  // Add pagination or other metadata if needed
}
