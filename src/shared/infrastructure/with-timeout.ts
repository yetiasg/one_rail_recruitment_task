export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms);
    promise
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch((e: unknown) => {
        clearTimeout(t);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(e);
      });
  });
}
