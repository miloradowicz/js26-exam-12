import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestWithPrincipal } from '../types';
import { User } from '../user/user.schema';
import { ROLES_KEY } from '../constants';

@Injectable()
export class AuthzService {
  constructor(
    private readonly reflector: Reflector,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async checkAuthorization(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles.length) {
      return true;
    }

    const principal = context
      .switchToHttp()
      .getRequest<RequestWithPrincipal>().user;

    const user = await this.userModel.findById(principal);
    return !!user && requiredRoles.includes(user.role);
  }
}
