import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthnService } from './authn.service';

@Injectable()
export class AuthnGuard implements CanActivate {
  constructor(private readonly authnService: AuthnService) {}

  async canActivate(context: ExecutionContext) {
    if (!(await this.authnService.getPrincipalForToken(context))) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
