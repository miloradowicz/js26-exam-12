import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Connection } from 'mongoose';

@ValidatorConstraint({ name: 'IsMongoDocument', async: true })
@Injectable()
export class IsImageRule implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  validate(value: unknown, _: ValidationArguments) {
    return (
      !!value &&
      typeof value === 'object' &&
      'originalname' in value &&
      !!value.originalname &&
      'mimetype' in value &&
      typeof value.mimetype === 'string' &&
      !!value.mimetype.match(/^image\//)
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an image`;
  }
}
