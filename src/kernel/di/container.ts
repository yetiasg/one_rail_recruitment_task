/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import "reflect-metadata";
import { Constructor, Token } from "./types";

/**
 * Simple Dependency Injection container.
 * - Providers are registered automatically by `@Injectable()`
 * - Dependencies are resolved via constructor parameter types
 * - Instances are cached (singleton scope)
 */
export class Container {
  private readonly providers = new Set<Function>();
  private readonly singletons = new Map<Function, unknown>();

  /** Registers a provider (called automatically by @Injectable)
   * @param token Class
   */
  register<T>(token: Token<T>): void {
    this.providers.add(token);
  }

  /**
   * Registers a pre-built instance (optional)
   * @param token Class
   * @param instance Class Instance
   */
  registerInstance<T>(token: Token<T>, instance: T): void {
    this.providers.add(token);
    this.singletons.set(token, instance);
  }

  /** Resolves a dependency (singleton) */
  resolve<T>(token: Token<T>): T {
    const cached = this.singletons.get(token);
    if (cached) return cached as T;

    if (!this.providers.has(token))
      throw new Error(
        `DI: ${token.name} is not registered. ` +
          `Add @Injectable() and make sure the module is imported.`,
      );

    const constructorParamTypes =
      ((Reflect.getMetadata(
        "design:paramtypes",
        token,
      ) as Constructor<unknown>[]) ||
        undefined) ??
      [];

    const dependencies = constructorParamTypes.map((dependency) =>
      this.resolve(dependency),
    );
    const instance = new token(...dependencies);

    this.singletons.set(token, instance);
    return instance;
  }
}
