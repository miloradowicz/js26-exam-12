import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class BodyWithFileInterceptor implements NestInterceptor {
  constructor(private readonly fieldName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const file = request.file;
    const body = request.body as object;

    request.body = {
      ...body,
      [this.fieldName]: file,
    };

    return next.handle();
  }
}
