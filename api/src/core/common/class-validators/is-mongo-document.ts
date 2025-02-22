import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsMongoDocumentRule } from './is-mongo-document.rule';
import { Type } from '@nestjs/common';

export const IsMongoDocument =
  <TModel extends object>(
    Model: Type<TModel>,
    fieldName?: string,
    inverse?: boolean,
    options?: ValidationOptions,
  ) =>
  (object: object, propertyName: string) =>
    registerDecorator({
      name: 'IsMongoDocument',
      target: object.constructor,
      propertyName,
      options,
      constraints: [Model, fieldName, inverse],
      validator: IsMongoDocumentRule,
    });
