import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsBangladeshPhoneNumber(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isBangladeshPhoneNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const phoneNumberRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
          return typeof value === 'string' && phoneNumberRegex.test(value);
        },
        defaultMessage() {
          return `${propertyName} must be a valid Bangladeshi phone number`;
        },
      },
    });
  };
}
