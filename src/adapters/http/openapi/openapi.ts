import { HttpMethod } from "@kernel/runtime/types";
import { buildSchemasFromDtos } from "./dto-schemas";
import {
  getOpenApiRoutes,
  OpenApiRouteMeta,
  OpenApiParamMeta,
} from "./registry";

export interface BuildOpenApiParams {
  title: string;
  version: string;
  serverUrl?: string;
}

function refSchema(dtoName: string) {
  return { $ref: `#/components/schemas/${dtoName}` };
}

// "/api/users/:userId" -> "/api/users/{userId}"
function normalizePath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return p.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
}

function extractPathParams(path: string): string[] {
  const matches = path.matchAll(/\{([A-Za-z0-9_]+)\}/g);
  return Array.from(matches, (match) => match[1]);
}

function buildParameters(route: OpenApiRouteMeta): unknown[] | undefined {
  const params = route.params ?? [];

  const normalizedPath = normalizePath(route.path);

  const implicitPathParams = extractPathParams(normalizedPath)
    .filter((name) => !params.some((p) => p.in === "path" && p.name === name))
    .map<OpenApiParamMeta>((name) => ({
      in: "path",
      name,
      required: true,
      schema: { type: "string" },
    }));

  const all = [...params, ...implicitPathParams];
  if (all.length === 0) return undefined;

  return all.map((p) => ({
    in: p.in,
    name: p.name,
    required: p.required ?? p.in === "path",
    description: p.description,
    schema: p.schema,
    example: p.example,
  }));
}

export function buildOpenApiDocument(params: BuildOpenApiParams) {
  const routes = getOpenApiRoutes();
  const schemas = buildSchemasFromDtos();

  const paths: Record<string, Partial<Record<HttpMethod, unknown>>> = {};

  for (const r of routes) {
    const path = normalizePath(r.path);

    paths[path] ??= {};
    paths[path][r.method] = routeToOperation(r);
  }

  return {
    openapi: "3.0.3",
    info: {
      title: params.title,
      version: params.version,
    },
    servers: params.serverUrl ? [{ url: params.serverUrl }] : undefined,
    paths,
    components: {
      schemas,
    },
  };
}

function routeToOperation(route: OpenApiRouteMeta) {
  type Operation = {
    tags: string[];
    summary?: string;
    description?: string;
    responses: { [key: number]: unknown };
    parameters: unknown[];
    requestBody?: {
      required: boolean;
      content: {
        [key: string]: {
          schema: unknown;
          example?: unknown;
        };
      };
    };
  };

  const operation: Operation = {
    tags: route.tags,
    summary: route.summary,
    description: route.description,
    parameters: [],
    responses: {},
  };

  const parameters = buildParameters(route);
  if (parameters) operation.parameters = parameters;

  if (route.requestBody?.dto) {
    operation.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: refSchema(route.requestBody.dto.name),
          ...(route.requestBody.example !== undefined
            ? { example: route.requestBody.example }
            : {}),
        },
      },
    };
  }

  for (const [statusStr, meta] of Object.entries(route.responses)) {
    const status = Number(statusStr);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const base: any = { description: meta.description };

    if (meta.dto) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      base.content = {
        "application/json": {
          schema: refSchema(meta.dto.name),
          ...(meta.example !== undefined ? { example: meta.example } : {}),
        },
      };
    }

    operation.responses[status] = base;
  }

  return operation;
}
