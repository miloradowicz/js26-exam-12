import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsImageRule } from './is-image.rule';

export const IsImage =
  (options?: ValidationOptions) => (object: object, propertyName: string) =>
    registerDecorator({
      name: 'IsImage',
      target: object.constructor,
      propertyName,
      options,
      validator: IsImageRule,
    });
