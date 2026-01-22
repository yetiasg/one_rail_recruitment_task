import "reflect-metadata";
import { PARAMS_METADATA_KEY } from "@server/metadata.keys";
import { ParamDefinition, ParamSource } from "@server/types";

function defineParam(
  target: object,
  methodName: string | symbol,
  parameterIndex: number,
  source: ParamSource,
  key?: string,
): void {
  const existing = Reflect.getMetadata(
    PARAMS_METADATA_KEY,
    target,
    methodName,
  ) as ParamDefinition[] | undefined;
  const params: ParamDefinition[] = existing ?? [];

  params.push({ index: parameterIndex, source, key });
  params.sort((a, b) => a.index - b.index);

  Reflect.defineMetadata(PARAMS_METADATA_KEY, params, target, methodName);
}

export function Req() {
  return function (
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ): void {
    defineParam(target, propertyKey, parameterIndex, "req");
  };
}

export function Res() {
  return function (
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ): void {
    defineParam(target, propertyKey, parameterIndex, "res");
  };
}

export function Param(name: string) {
  return function (
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ): void {
    defineParam(target, propertyKey, parameterIndex, "param", name);
  };
}

export function Query(name: string) {
  return function (
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ): void {
    defineParam(target, propertyKey, parameterIndex, "query", name);
  };
}

export function Body() {
  return function (
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ): void {
    defineParam(target, propertyKey, parameterIndex, "body");
  };
}
