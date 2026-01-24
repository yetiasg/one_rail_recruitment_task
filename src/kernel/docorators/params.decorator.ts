import "reflect-metadata";
import { PARAMS_METADATA_KEY } from "@kernel/metadata/metadata.keys";
import {
  Constructor,
  ParamDefinition,
  ParamSource,
} from "@kernel/runtime/types";

function defineParam(
  target: object,
  methodName: string | symbol,
  parameterIndex: number,
  source: ParamSource,
  key?: string,
  dto?: Constructor<object>,
): void {
  const existing = Reflect.getMetadata(
    PARAMS_METADATA_KEY,
    target,
    methodName,
  ) as ParamDefinition[] | undefined;
  const params: ParamDefinition[] = existing ?? [];

  params.push({ index: parameterIndex, source, key, dto });
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

export function Body<T extends object>(
  dto: Constructor<T>,
): ParameterDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    parameterIndex: number,
  ): void {
    if (dto && typeof dto !== "function")
      throw new Error(
        `@Body() expects a class constructor, got: ${typeof dto}`,
      );

    defineParam(target, propertyKey, parameterIndex, "body", undefined, dto);
  };
}
