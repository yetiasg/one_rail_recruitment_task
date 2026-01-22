/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import "reflect-metadata";
import { AbstractConstructor, Constructor, Token } from "./types";

/**
 * Simple Dependency Injection container.
 * - Providers are registered automatically by `@Injectable()`
 * - Dependencies are resolved via constructor parameter types
 * - Instances are cached (singleton scope)
 */
export class Container {
  private readonly providers = new Set<Function>();
  private readonly singletons = new Map<Function, unknown>();

  private readonly bindings = new Map<Function, Function>();

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

  /**
   * Bind abstract class (port) to concrete class (adapter).
   * Example:
   *   container.bind(OrganizationRepositoryPort, OrganizationRepositoryAdapter)
   */
  bind<T extends object>(
    abstraction: AbstractConstructor<T>,
    implementation: Constructor<T>,
  ): void {
    this.bindings.set(abstraction, implementation);
    this.providers.add(implementation);
  }

  /** Resolves a dependency (singleton) */
  resolve<T extends object>(token: AbstractConstructor<T> | Constructor<T>): T {
    const concrete =
      (this.bindings.get(token) as Constructor<T> | undefined) ??
      (token as Constructor<T>);

    const cached = this.singletons.get(concrete);
    if (cached) return cached as T;

    if (!this.providers.has(concrete)) {
      const name = (concrete as Function).name || "Anonymous";
      throw new Error(
        `DI: ${name} is not registered. ` +
          `Add @Injectable() and make sure the module is imported.`,
      );
    }
    const constructorParamTypes =
      ((Reflect.getMetadata("design:paramtypes", concrete) as Function[]) ||
        undefined) ??
      [];

    const dependencies = constructorParamTypes.map((dependency) => {
      if (dependency === Object) {
        // typical case: interface/type was used
        throw new Error(
          `DI: Cannot resolve dependency "Object" in ${concrete.name}. ` +
            `Use abstract classes (ports) + container.bind(...) or inject a concrete class.`,
        );
      }
      return this.resolve(dependency as Constructor<T>);
    });
    const instance = new concrete(...dependencies);

    this.singletons.set(concrete, instance);
    return instance;
  }
}
