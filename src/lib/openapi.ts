import { OpenAPISpec, ParsedEndpoint, Parameter, PathItem, Operation } from '@/types/api';

const OPENAPI_URL = 'https://api.passport.xyz/v2/openapi.json';

export async function fetchOpenAPISpec(): Promise<OpenAPISpec> {
  const response = await fetch(OPENAPI_URL, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`);
  }

  return response.json();
}

export function parseEndpoints(spec: OpenAPISpec): ParsedEndpoint[] {
  const endpoints: ParsedEndpoint[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    const methods: Array<keyof PathItem> = ['get', 'post', 'put', 'delete', 'patch'];

    for (const method of methods) {
      const operation = pathItem[method] as Operation | undefined;
      if (!operation) continue;

      const endpoint: ParsedEndpoint = {
        id: operation.operationId || `${method}-${path}`,
        method: method.toUpperCase() as ParsedEndpoint['method'],
        path,
        summary: operation.summary || '',
        description: stripHtmlTags(operation.description || ''),
        tag: operation.tags?.[0] || 'General',
        parameters: operation.parameters || [],
        requestBody: operation.requestBody,
        responses: operation.responses,
        requiresAuth: checkRequiresAuth(operation),
      };

      endpoints.push(endpoint);
    }
  }

  return endpoints;
}

export function groupEndpointsByTag(endpoints: ParsedEndpoint[]): Record<string, ParsedEndpoint[]> {
  const grouped: Record<string, ParsedEndpoint[]> = {};

  for (const endpoint of endpoints) {
    if (!grouped[endpoint.tag]) {
      grouped[endpoint.tag] = [];
    }
    grouped[endpoint.tag].push(endpoint);
  }

  return grouped;
}

function checkRequiresAuth(operation: Operation): boolean {
  if (!operation.security) return false;
  return operation.security.some(req => Object.keys(req).length > 0);
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

export function getBaseUrl(spec: OpenAPISpec): string {
  return spec.servers?.[0]?.url || 'https://api.passport.xyz';
}

export function resolveSchema(spec: OpenAPISpec, schema: { $ref?: string } | undefined): Record<string, unknown> | undefined {
  if (!schema) return undefined;

  if (schema.$ref) {
    const refPath = schema.$ref.replace('#/components/schemas/', '');
    return spec.components.schemas[refPath] as Record<string, unknown>;
  }

  return schema as Record<string, unknown>;
}

export function getPathParameters(endpoint: ParsedEndpoint): Parameter[] {
  return endpoint.parameters.filter(p => p.in === 'path');
}

export function getQueryParameters(endpoint: ParsedEndpoint): Parameter[] {
  return endpoint.parameters.filter(p => p.in === 'query');
}

export function buildUrl(
  baseUrl: string,
  path: string,
  pathParams: Record<string, string>,
  queryParams: Record<string, string>
): string {
  let url = path;

  // Replace path parameters (keep {param} if value is empty)
  for (const [key, value] of Object.entries(pathParams)) {
    if (value) {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    }
    // If empty, leave {key} in place (it's already there in the path)
  }

  // Add query parameters
  const queryString = Object.entries(queryParams)
    .filter(([, value]) => value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  const fullUrl = `${baseUrl}${url}`;
  return queryString ? `${fullUrl}?${queryString}` : fullUrl;
}
