export type Constructor<T> = new (...args: unknown[]) => T;
export type AbstractConstructor<T extends object> = abstract new (
  ...args: unknown[]
) => T;

export type Token<T> = Constructor<T>;
