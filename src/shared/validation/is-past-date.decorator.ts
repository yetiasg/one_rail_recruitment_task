import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function IsPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "IsPastDate",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: unknown, _args: ValidationArguments) {
          if (!(value instanceof Date)) return false;
          return value.getTime() < Date.now();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a date in the past`;
        },
      },
    });
  };
}
