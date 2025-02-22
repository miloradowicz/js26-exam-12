import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthnGuard } from 'src/core/authn/authn.guard';
import { AuthzGuard } from 'src/core/authz/authz.guard';
import { Roles } from 'src/core/authz/roles/roles.decorator';

export const Auth = (...roles: string[]) => {
  return applyDecorators(Roles(...roles), UseGuards(AuthnGuard, AuthzGuard));
};
