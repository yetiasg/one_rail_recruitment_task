import "reflect-metadata";
import { ROUTES_METADATA_KEY } from "@server/metadata.keys";
import { HttpMethod, RouteDefinition } from "@server/types";

function createMethodDecorator(method: HttpMethod, path: string = "") {
  return function (target: object, propertyKey: string): void {
    const existing = Reflect.getMetadata(ROUTES_METADATA_KEY, target) as
      | RouteDefinition[]
      | undefined;

    const routes: RouteDefinition[] = existing ?? [];
    routes.push({ method, path, handlerName: propertyKey });

    Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target);
  };
}

export const Get = (path: string = "") => createMethodDecorator("get", path);
export const Post = (path: string = "") => createMethodDecorator("post", path);
export const Put = (path: string = "") => createMethodDecorator("put", path);
export const Patch = (path: string = "") =>
  createMethodDecorator("patch", path);
export const Delete = (path: string = "") =>
  createMethodDecorator("delete", path);
