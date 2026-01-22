import { appContainer } from "./app-container";
import { Constructor } from "./types";

/**
 * Marks a class as DI-managed.
 * Automatically registers it in the container.
 */
export function Injectable(): ClassDecorator {
  return (target) => {
    appContainer.register(target as unknown as Constructor<unknown>);
  };
}
