import { ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/user/user.schema';
import { RequestWithPrincipal } from '../types';

@Injectable()
export class AuthnService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async getPrincipalForToken(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithPrincipal>();
    const token = request.get('Authorization');

    if (!token) {
      return true;
    }

    const principal = await this.userModel.findOne({ token });

    if (!principal) {
      return false;
    }

    request.user = principal;
    return true;
  }
}
