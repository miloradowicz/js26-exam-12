import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import config from 'src/config';

@Injectable()
export class GoogleAuthService extends OAuth2Client {
  constructor() {
    super(config.google.clientId, config.google.clientSecret);
  }
}
