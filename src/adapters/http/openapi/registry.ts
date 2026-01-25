import { Constructor } from "@kernel/di/types";
import { HttpMethod } from "@kernel/runtime/types";

export type OpenApiParamLocation = "path" | "query";
export type OpenApiSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array";

export interface OpenApiSchemaMeta {
  type: OpenApiSchemaType;
  format?: string;
  enum?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  items?: OpenApiSchemaMeta;
}

export interface OpenApiParamMeta {
  in: OpenApiParamLocation;
  name: string;
  required?: boolean;
  description?: string;
  schema: OpenApiSchemaMeta;
  example?: unknown;
}

export interface OpenApiResponseMeta {
  description: string;
  dto?: Constructor<unknown>;
  example?: unknown;
}

export interface OpenApiRequestBodyMeta {
  dto: Constructor<unknown>;
  example?: unknown;
}

export interface OpenApiRouteMeta {
  method: HttpMethod;
  path: string;
  tags: string[];
  summary?: string;
  description?: string;

  params?: OpenApiParamMeta[];
  requestBody?: OpenApiRequestBodyMeta;

  responses: Record<number, OpenApiResponseMeta>;
}

const registeredRoutes: OpenApiRouteMeta[] = [];
const routeKeys = new Set<string>();
const dtoSet = new Set<Constructor<unknown>>();

function routeKey(method: HttpMethod, path: string): string {
  return `${String(method).toUpperCase()} ${path}`;
}

export function registerOpenApiRoutes(items: OpenApiRouteMeta[]): void {
  for (const route of items) {
    const key = routeKey(route.method, route.path);
    if (!routeKeys.has(key)) {
      routeKeys.add(key);
      registeredRoutes.push(route);
    }

    if (route.requestBody?.dto) dtoSet.add(route.requestBody.dto);

    for (const resp of Object.values(route.responses)) {
      if (resp.dto) dtoSet.add(resp.dto);
    }
  }
}

export function getOpenApiRoutes(): OpenApiRouteMeta[] {
  return [...registeredRoutes];
}

export function getOpenApiDtos(): Constructor<unknown>[] {
  return [...dtoSet];
}
