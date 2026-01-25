export abstract class AppError extends Error {
  name: string;
  details?: unknown;

  protected constructor(message: string, details?: unknown) {
    super(message);
    this.details = details;
  }
}
