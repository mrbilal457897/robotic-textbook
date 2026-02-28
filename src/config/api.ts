/**
 * API Configuration
 * API base URL and client configuration
 */

// Safe environment variable access for browser environments
// In Docusaurus, process.env is only available during build/SSR, not in browser runtime
declare const API_URL: string | undefined;

function getApiBaseUrl(): string {
  // 1. Check for build-time injected variable (from webpack DefinePlugin)
  if (typeof API_URL !== 'undefined') {
    return API_URL;
  }

  // 2. Check for process.env during SSR/build time (safe check)
  if (typeof process !== 'undefined' && process?.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // 3. Default fallback for local development
  return 'http://localhost:8000';
}

export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints Configuration
 */
export const API_ENDPOINTS = {
  auth: {
    githubLogin: '/api/v1/auth/github/login',
    githubCallback: '/api/v1/auth/github/callback',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout',
  },
  chat: '/api/v1/chat',
  conversations: '/api/v1/conversations',
} as const;

/**
 * Get full API URL for an endpoint
 */
export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

/**
 * API Error class with structured error information
 */
export class APIClientError extends Error {
  constructor(
    public status: number,
    public error: string,
    public details?: Record<string, any>
  ) {
    super(error);
    this.name = 'APIClientError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'UNKNOWN_ERROR',
      message: response.statusText,
      status_code: response.status,
    }));

    throw new APIClientError(response.status, errorData.message, errorData.details);
  }

  return response.json();
}
