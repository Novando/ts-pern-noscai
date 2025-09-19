import { ApiResponse, Clinic, ListResponse } from '@/app/types/clinic';
import { getTenantIdFromCookie } from '@/app/utils/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  credentials?: RequestCredentials;
  skipTenantHeader?: boolean; // Option to skip adding the tenant header
};

type RequestOptionsWithBody = RequestOptions & {
  body?: any;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if ((response.status < 200 || response.status > 299) && response.status !== 304) {
    const error = new Error(`HTTP error! status: ${response.status}`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }
  
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error parsing JSON:', error.message);
    }
    throw new Error('Failed to parse response as JSON');
  }
}

function buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(API_BASE_URL + path);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

function getDefaultHeaders(options: RequestOptions): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add tenant ID header if not explicitly skipped
  if (!options.skipTenantHeader) {
    const tenantId = getTenantIdFromCookie();
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }
  }

  // Ensure CORS-related headers are not overridden
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (key.toLowerCase().startsWith('access-control-')) {
        headers[key] = value;
      }
    });
  }

  return headers;
}

export const api = {
  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, params, credentials = 'include' } = options;
    
    const response = await fetch(buildUrl(path, params), {
      method: 'GET',
      headers: {
        ...getDefaultHeaders(options),
        ...headers,
      },
      credentials,
    });
    
    return handleResponse<T>(response);
  },
  
  async post<T>(path: string, options: RequestOptionsWithBody = {}): Promise<T> {
    const { headers = {}, params, body, credentials = 'include' } = options;
    
    const response = await fetch(buildUrl(path, params), {
      method: 'POST',
      headers: {
        ...getDefaultHeaders(options),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials,
    });
    
    return handleResponse<T>(response);
  },
  
  async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, params, credentials = 'include' } = options;
    
    const response = await fetch(buildUrl(path, params), {
      method: 'DELETE',
      headers: {
        ...getDefaultHeaders(options),
        ...headers,
      },
      credentials,
    });
    
    return handleResponse<T>(response);
  },
  
  async put<T>(path: string, options: RequestOptionsWithBody = {}): Promise<T> {
    const { headers = {}, params, body, credentials = 'include' } = options;
    
    const response = await fetch(buildUrl(path, params), {
      method: 'PUT',
      headers: {
        ...getDefaultHeaders(options),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials,
    });
    
    return handleResponse<T>(response);
  },
  
  async patch<T>(path: string, options: RequestOptionsWithBody = {}): Promise<T> {
    const { headers = {}, params, body, credentials = 'include' } = options;
    
    const response = await fetch(buildUrl(path, params), {
      method: 'PATCH',
      headers: {
        ...getDefaultHeaders(options),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials,
    });
    
    return handleResponse<T>(response);
  },
};
