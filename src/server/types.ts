export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handlerName: string;
}

export type ControllerConstructor = new () => object;

export interface Constructor {
  new (...args: never[]): object;
}

export type ParamSource = "req" | "res" | "param" | "query" | "body";

export interface ParamDefinition {
  index: number;
  source: ParamSource;
  key?: string; // param/query
}
