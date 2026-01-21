import { ApiRequest, ApiResponse } from '@/types/api';

const PASSPORT_API_BASE = 'https://api.passport.xyz';

export async function executeRequest(request: ApiRequest): Promise<ApiResponse> {
  const startTime = performance.now();

  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    // Extract headers
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Parse response data
    let data: unknown;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
    } else {
      data = await response.text();
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers,
      data,
      duration,
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    return {
      status: 0,
      statusText: 'Network Error',
      headers: {},
      data: {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      },
      duration,
    };
  }
}

/**
 * Build a request that goes through our server-side proxy.
 * The proxy adds the API key server-side, keeping it secure.
 * Individual Verifications (api.holonym.io) use a separate proxy without API key.
 */
export function buildProxiedRequest(
  method: string,
  originalUrl: string,
  body?: Record<string, unknown>
): ApiRequest {
  // Extract the path from the original URL
  const url = new URL(originalUrl);
  const path = url.pathname;
  const queryParams = url.searchParams;

  // Use different proxy routes based on the API
  const isHolonymApi = originalUrl.includes('api.holonym.io');
  const isSignProtocol = originalUrl.includes('sign.global');
  let proxyPath = '/api/proxy';
  if (isHolonymApi) proxyPath = '/api/proxy/holonym';
  if (isSignProtocol) proxyPath = '/api/proxy/sign';
  const proxyUrl = new URL(proxyPath, window.location.origin);
  proxyUrl.searchParams.set('path', path);

  // Copy over other query params
  queryParams.forEach((value, key) => {
    proxyUrl.searchParams.set(key, value);
  });

  return {
    method,
    url: proxyUrl.toString(),
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  };
}

/**
 * Build a direct API request (for code samples display).
 * This shows the user what the actual API call looks like.
 */
export function buildDirectApiRequest(
  method: string,
  url: string,
  apiKey: string,
  body?: Record<string, unknown>
): ApiRequest {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  return {
    method,
    url,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };
}
