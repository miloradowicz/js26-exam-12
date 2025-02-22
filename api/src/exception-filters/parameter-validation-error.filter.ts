import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

export class ParameterValidationError extends Error {
  constructor(
    public kind: string,
    public value: any,
    public path: string,
  ) {
    super();
  }
}

@Catch(ParameterValidationError)
export class ParameterValidationErrorFilter implements ExceptionFilter {
  catch(exception: ParameterValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const errors = {
      [exception.path]: {
        name: 'QueryValidationError',
        messages: `"${exception.value}" is not a valid at ${exception.path}; value must be convertible to type "${exception.kind}"`,
      },
    };

    res.status(400).json({ type: 'ValidationError', errors });
  }
}
