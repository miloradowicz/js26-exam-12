import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class PassportService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username });

    if (!user || !(await user.checkPassword(password))) {
      return null;
    }

    user.generateToken();
    await user.save();

    return user;
  }
}
