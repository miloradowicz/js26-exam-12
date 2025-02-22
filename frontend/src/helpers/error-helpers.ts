import { AuthenticationError, GenericError, ValidationError } from '../types';

export const isAuthenticationError = (
  obj: unknown,
): obj is AuthenticationError =>
  !!obj &&
  typeof obj === 'object' &&
  'type' in obj &&
  typeof obj.type === 'string' &&
  obj.type === 'AuthenticationError' &&
  'error' in obj &&
  typeof obj.error === 'object' &&
  !!obj.error &&
  'name' in obj.error &&
  typeof obj.error.name === 'string' &&
  'message' in obj.error &&
  typeof obj.error.message === 'string';

export const isValidationError = (obj: unknown): obj is ValidationError =>
  !!obj &&
  typeof obj === 'object' &&
  'type' in obj &&
  typeof obj.type === 'string' &&
  obj.type === 'ValidationError' &&
  'errors' in obj &&
  typeof obj.errors === 'object' &&
  !!obj.errors &&
  Object.values(obj.errors).every(
    (x) =>
      'name' in x &&
      typeof x.name === 'string' &&
      'messages' in x &&
      Array.isArray(x.messages) &&
      x.messages.every((x: unknown) => typeof x === 'string'),
  );

export const isGenericError = (obj: unknown): obj is GenericError =>
  !!obj &&
  typeof obj === 'object' &&
  'type' in obj &&
  typeof obj.type === 'string' &&
  'error' in obj &&
  typeof obj.error === 'string';
