import { Module } from '@nestjs/common';
import { AuthzService } from './authz/authz.service';
import { AuthnService } from './authn/authn.service';
import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UserModule, UsersModule],
  providers: [AuthnService, AuthzService],
  exports: [AuthnService, AuthzService, UserModule, UsersModule],
})
export class CoreModule {}
