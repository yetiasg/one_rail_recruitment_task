import "reflect-metadata";
import { CONTROLLER_PREFIX } from "@server/metadata.keys";
import { controllers } from "@server/controller-registry";
import { Constructor } from "@server/types";
import { Injectable } from "@server/di/injectable.decorator";

/**
 * Register route controller
 * @param prefix - set route path
 */
export function Controller(prefix: string = "") {
  return function <T extends Constructor>(target: T) {
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
