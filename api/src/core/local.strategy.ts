import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportService } from './passport.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private passportService: PassportService) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string) {
    const user = await this.passportService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException({
        type: 'AuthenticationError',
        error: {
          name: 'AuthenticationError',
          message: 'Invalid username or password',
        },
      });
    }

    return user;
  }
}
