import { AppError } from "./app-error";

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", details?: unknown) {
    super(message, details);
    this.name = "InternalServerError";
  }
}
