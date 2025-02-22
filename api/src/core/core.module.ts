import { Module } from '@nestjs/common';
import { AuthzService } from './authz/authz.service';
import { AuthnService } from './authn/authn.service';
import { SchemasModule } from './schemas/schemas.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [SchemasModule, UsersModule],
  providers: [AuthnService, AuthzService],
  exports: [AuthnService, AuthzService, SchemasModule, UsersModule],
})
export class CoreModule {}
