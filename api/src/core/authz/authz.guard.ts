import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthzService } from './authz.service';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private readonly authzService: AuthzService) {}

  async canActivate(context: ExecutionContext) {
    return this.authzService.checkAuthorization(context);
  }
}
