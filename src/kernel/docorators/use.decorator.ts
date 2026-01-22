import "reflect-metadata";
import { MIDDLEWARE_METADATA_KEY } from "@kernel/metadata/metadata.keys";
import { RequestHandler } from "express";

export function Use(...middlewares: RequestHandler[]) {
  return function (target: object, propertyKey?: string | symbol): void {
    // Method decorator handler
    if (propertyKey) {
      const existing =
        (Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, target, propertyKey) as
          | RequestHandler[]
          | undefined) ?? [];

      Reflect.defineMetadata(
        MIDDLEWARE_METADATA_KEY,
        [...middlewares, ...existing],
        target,
        propertyKey,
      );
      return;
    }

    // Controller decorator handler
    const targetPrototype = (target as { prototype: object }).prototype;
    const existing =
      (Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, targetPrototype) as
        | RequestHandler[]
        | undefined) ?? [];

    Reflect.defineMetadata(
      MIDDLEWARE_METADATA_KEY,
      [...middlewares, ...existing],
      targetPrototype,
    );
  };
}
