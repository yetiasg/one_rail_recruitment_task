import { AppError } from "./app-error";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(message, details);
    this.name = "UnauthorizedError";
  }
}
