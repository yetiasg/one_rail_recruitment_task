import "reflect-metadata";
import { appContainer } from "@kernel/di/app-container";
import { controllers } from "@kernel/registry/controller-registry";
import { ParamDefinition, RouteDefinition } from "@kernel/runtime/types";
import {
  CONTROLLER_PREFIX,
  MIDDLEWARE_METADATA_KEY,
  PARAMS_METADATA_KEY,
  ROUTES_METADATA_KEY,
} from "@kernel/metadata/metadata.keys";

import { Router } from "express";
import type { Express, Request, RequestHandler, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { BadRequestException } from "@kernel/http/http-exceptions";
import { mapValidationErrors } from "@kernel/http/validation-error-mapper";

function normalizePrefix(prefix: string): string {
  const _prefix = prefix.trim();
  if (!_prefix) return "";
  const noSlashes = _prefix.replace(/^\/+|\/+$/g, "");
  return `/${noSlashes}`;
}

function normalizePath(path: string): string {
  const _prefix = path.trim();
  if (!_prefix) return "/";
  const withSlash = _prefix.startsWith("/") ? _prefix : `/${_prefix}`;
  return withSlash.replace(/\/+$/g, "") || "/";
}

function buildArgs(
  req: Request,
  res: Response,
  defs?: ParamDefinition[],
): unknown[] {
  if (!defs || defs.length === 0) return [req, res];

  const maxIndex = defs.reduce(
    (prev, paramDefinition) => Math.max(prev, paramDefinition.index),
    -1,
  );
  const args: unknown[] = new Array(maxIndex + 1).fill(undefined);

  for (const { source, index, key, dto } of defs) {
    switch (source) {
      case "req":
        args[index] = req;
        break;
      case "res":
        args[index] = res;
        break;
      case "param":
        args[index] = key ? req.params?.[key] : undefined;
        break;
      case "query":
        args[index] = key ? (req.query?.[key] as unknown) : undefined;
        break;
      case "body": {
        const body = req.body as Record<string, unknown> | undefined;
        if (!dto) {
          args[index] = body;
          break;
        }

        const instance = plainToInstance(dto, body, {
          enableImplicitConversion: false,
        });

        const errors = validateSync(instance, {
          whitelist: true,
          forbidNonWhitelisted: true,
          forbidUnknownValues: true,
        });

        if (errors.length > 0)
          throw new BadRequestException("Validation failed", {
            errors: mapValidationErrors(errors),
          });

        args[index] = instance;
        break;
      }
    }
  }

  return args;
}

export function registerControllers(
  app: Express,
  options?: { globalPrefix?: string },
) {
  const globalPrefix = normalizePrefix(options?.globalPrefix ?? "");
  const baseRouter = Router();

  controllers.forEach((ControllerClass) => {
    const controller = appContainer.resolve(ControllerClass);

    const prefixRaw =
      (Reflect.getMetadata(
        CONTROLLER_PREFIX,
        ControllerClass.prototype as object,
      ) as string | undefined) ?? "";
    const prefix = normalizePrefix(prefixRaw);

    const routes: RouteDefinition[] = Reflect.getMetadata(
      ROUTES_METADATA_KEY,
      ControllerClass.prototype as object,
    ) as RouteDefinition[];

    const controllerMiddlewares =
      (Reflect.getMetadata(
        MIDDLEWARE_METADATA_KEY,
        ControllerClass.prototype as object,
      ) as RequestHandler[] | undefined) ?? [];

    const router = Router();

    for (const route of routes) {
      const path = normalizePath(route.path);
      const handler = controller[route.handlerName as keyof typeof controller];

      if (typeof handler !== "function")
        throw new Error(`Handler ${route.handlerName} is not a function`);

      const paramDefinitions = Reflect.getMetadata(
        PARAMS_METADATA_KEY,
        ControllerClass.prototype as object,
        route.handlerName,
      ) as ParamDefinition[] | undefined;

      const routeMiddlewares =
        (Reflect.getMetadata(
          MIDDLEWARE_METADATA_KEY,
          ControllerClass.prototype as object,
          route.handlerName,
        ) as RequestHandler[] | undefined) ?? [];

      router[route.method](
        path,
        ...controllerMiddlewares,
        ...routeMiddlewares,
        (req, res, next) => {
          try {
            const args = buildArgs(req, res, paramDefinitions);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const result = (handler as (...rest: unknown[]) => unknown).apply(
              controller,
              args,
            );
            Promise.resolve(result).catch(next);
          } catch (err) {
            next(err);
          }
        },
      );
    }

    baseRouter.use(prefix ?? "/", router);
  });

  if (globalPrefix) app.use(globalPrefix, baseRouter);
  else app.use(baseRouter);
}
