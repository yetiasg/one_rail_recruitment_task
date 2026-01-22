import "reflect-metadata";
import { Injectable } from "@kernel/di/injectable.decorator";
import { CONTROLLER_PREFIX } from "@kernel/metadata/metadata.keys";
import { controllers } from "@kernel/registry/controller-registry";
import { ControllerConstructor } from "@kernel/runtime/types";

/**
 * Register route controller
 * @param prefix - set route path
 */
export function Controller(prefix: string = "") {
  return function <T extends ControllerConstructor>(target: T): void {
    // Inject Controller using ID-container
    Injectable()(target);

    Reflect.defineMetadata(
      CONTROLLER_PREFIX,
      prefix,
      target.prototype as object,
    );
    controllers.push(target);
  };
}
