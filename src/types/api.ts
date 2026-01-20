// OpenAPI types for the Passport API

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, PathItem>;
  components: {
    schemas: Record<string, Schema>;
    securitySchemes?: Record<string, SecurityScheme>;
  };
  servers: Server[];
}

export interface Server {
  url: string;
  description?: string;
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
}

export interface Operation {
  operationId: string;
  summary: string;
  description: string;
  tags: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  security?: SecurityRequirement[];
}

export interface Parameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  description?: string;
  required: boolean;
  schema: Schema;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, MediaType>;
}

export interface MediaType {
  schema: Schema;
}

export interface Response {
  description: string;
  content?: Record<string, MediaType>;
}

export interface Schema {
  type?: string;
  title?: string;
  description?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  enum?: string[];
  default?: unknown;
  nullable?: boolean;
  $ref?: string;
  anyOf?: Schema[];
  oneOf?: Schema[];
  allOf?: Schema[];
  additionalProperties?: boolean | Schema;
}

export interface SecurityScheme {
  type: string;
  in: string;
  name: string;
}

export type SecurityRequirement = Record<string, string[]>;

// Parsed endpoint for UI display
export interface ParsedEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  description: string;
  tag: string;
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  requiresAuth: boolean;
}

// API execution types
export interface ApiRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
}
