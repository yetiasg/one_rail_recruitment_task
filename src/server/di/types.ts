export type Constructor<T> = new (...args: unknown[]) => T;

export type Token<T> = Constructor<T>;
