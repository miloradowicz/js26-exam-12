import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OverrideAuthGuardsStupidSilentRejectUponNoUsernameAndPasswordBodyGuard
  implements CanActivate
{
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (
      typeof request.body === 'object' &&
      Object.values(request.body as object).some((x) => !x)
    ) {
      throw new UnauthorizedException({
        type: 'AuthenticationError',
        error: {
          name: 'AuthenticationError',
          message: 'Invalid username or password',
        },
      });
    }

    return true;
  }
}
