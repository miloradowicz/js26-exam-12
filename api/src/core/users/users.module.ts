import { Module } from '@nestjs/common';
import { SchemasModule } from '../schemas/schemas.module';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../local.strategy';
import { PassportService } from '../passport.service';
import { AuthnService } from '../authn/authn.service';
import { AuthzService } from '../authz/authz.service';
import { IsMongoDocumentRule } from '../common/class-validators/is-mongo-document.rule';
import { GoogleAuthService } from './google-auth/google-auth.service';

@Module({
  imports: [SchemasModule, PassportModule],
  controllers: [UsersController],
  providers: [
    AuthnService,
    AuthzService,
    PassportService,
    LocalStrategy,
    IsMongoDocumentRule,
    GoogleAuthService,
  ],
})
export class UsersModule {}
