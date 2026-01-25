import { AppError } from "./app-error";

export class NotFoundError extends AppError {
  constructor(message = "Not Found", details?: unknown) {
    super(message, details);
    this.name = "NotFoundError";
  }
}
