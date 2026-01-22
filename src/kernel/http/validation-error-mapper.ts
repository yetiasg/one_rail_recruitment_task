import type { ValidationError } from "class-validator";

export interface FieldValidationError {
  property: string;
  constraints?: Record<string, string>;
  children?: FieldValidationError[];
}

export function mapValidationErrors(
  errors: ValidationError[],
): FieldValidationError[] {
  return errors.map((e) => ({
    property: e.property,
    constraints: e.constraints,
    children:
      e.children && e.children.length > 0
        ? mapValidationErrors(e.children)
        : undefined,
  }));
}
