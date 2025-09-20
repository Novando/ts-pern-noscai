import { getClinicIdFromCookie } from '@/app/utils/cookies';
import { useToast } from '@/src/contexts/ToastContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  credentials?: RequestCredentials;
  skipTenantHeader?: boolean;
  skipErrorToast?: boolean; // Add option to skip showing error toast
};

type RequestOptionsWithBody = RequestOptions & {
  body?: any;
};

async function handleResponse<T>(response: Response, skipErrorToast = false): Promise<T> {
  if ((response.status < 200 || response.status > 299) && response.status !== 304) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }

    const error = new Error(errorMessage) as Error & { status?: number };
    error.status = response.status;

    if (!skipErrorToast) {
      const { showError } = useToast();
      showError(errorMessage);
    }

    throw error;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  try {
    return await response.json();
  } catch (error) {
    const errorMessage = 'Failed to parse response as JSON';
    if (!skipErrorToast) {
      const { showError } = useToast();
      showError(errorMessage);
    }
    throw new Error(errorMessage);
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
    const tenantId = getClinicIdFromCookie();
    console.log(tenantId);
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }
  }

  return headers;
}

export const api = {
  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, params, credentials = 'include', skipErrorToast = false } = options;

    try {
      const response = await fetch(buildUrl(path, params), {
        method: 'GET',
        headers: {
          // 'Access-Control-Allow-Origin': '*',
          ...getDefaultHeaders(options),
          ...headers,
        },
        credentials,
      });

      return handleResponse<T>(response, skipErrorToast);
    } catch (error) {
      if (!skipErrorToast && error instanceof Error) {
        const { showError } = useToast();
        showError(error.message);
      }
      throw error;
    }
  },

  async post<T>(path: string, options: RequestOptionsWithBody = {}): Promise<T> {
    const { headers = {}, params, body, credentials = 'include', skipErrorToast = false } = options;

    try {
      const response = await fetch(buildUrl(path, params), {
        method: 'POST',
        headers: {
          ...getDefaultHeaders(options),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials,
      });

      return handleResponse<T>(response, skipErrorToast);
    } catch (error) {
      if (!skipErrorToast && error instanceof Error) {
        const { showError } = useToast();
        showError(error.message);
      }
      throw error;
    }
  },

  async put<T>(path: string, options: RequestOptionsWithBody = {}): Promise<T> {
    const { headers = {}, params, body, credentials = 'include', skipErrorToast = false } = options;

    try {
      const response = await fetch(buildUrl(path, params), {
        method: 'PUT',
        headers: {
          ...getDefaultHeaders(options),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials,
      });

      return handleResponse<T>(response, skipErrorToast);
    } catch (error) {
      if (!skipErrorToast && error instanceof Error) {
        const { showError } = useToast();
        showError(error.message);
      }
      throw error;
    }
  },

  async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { headers = {}, params, credentials = 'include', skipErrorToast = false } = options;

    try {
      const response = await fetch(buildUrl(path, params), {
        method: 'DELETE',
        headers: {
          ...getDefaultHeaders(options),
          ...headers,
        },
        credentials,
      });

      return handleResponse<T>(response, skipErrorToast);
    } catch (error) {
      if (!skipErrorToast && error instanceof Error) {
        const { showError } = useToast();
        showError(error.message);
      }
      throw error;
    }
  },

  async patch<T>(path: string, options: RequestOptionsWithBody = {}): Promise<T> {
    const { headers = {}, params, body, credentials = 'include', skipErrorToast = false } = options;

    try {
      const response = await fetch(buildUrl(path, params), {
        method: 'PATCH',
        headers: {
          ...getDefaultHeaders(options),
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials,
      });

      return handleResponse<T>(response, skipErrorToast);
    } catch (error) {
      if (!skipErrorToast && error instanceof Error) {
        const { showError } = useToast();
        showError(error.message);
      }
      throw error;
    }
  },
};
