import { AppError } from "./app-error";

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details?: unknown) {
    super(message, details);
    this.name = "BadRequestError";
  }
}
