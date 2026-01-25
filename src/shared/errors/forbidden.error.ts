import { AppError } from "./app-error";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown) {
    super(message, details);
    this.name = "ForbiddenError";
  }
}
