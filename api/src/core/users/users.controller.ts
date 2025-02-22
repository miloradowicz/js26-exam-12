import {
  Body,
  Controller,
  Delete,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../schemas/user.schema';
import { Auth } from '../common/auth/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { useStorage } from '../common/storage/storage';
import { join } from 'path';
import config from 'src/config';
import { Principal } from '../common/principal/principal.param-decorator';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { GoogleCredentialDto } from './google-credential.dto';
import { nanoid } from 'nanoid';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly googleService: GoogleAuthService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: useStorage(
        join(config.rootPath, config.publicPath, 'uploads/avatars'),
      ),
    }),
  )
  async register(
    @Body() userDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = new this.userModel({
      ...userDto,
      ...(file
        ? {
            avatar: join('/', 'uploads/avatars', file.filename),
          }
        : {}),
    });
    user.generateToken();
    await user.save();

    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  login(@Principal() principal: User) {
    return { user: principal };
  }

  @Auth('user', 'admin')
  @Delete('sessions')
  async logout(@Principal() principal: User) {
    const user = await this.userModel.findById(principal._id);

    if (user) {
      user.clearToken();
      await user.save();
    }

    return { user: null };
  }

  @Post('google')
  async googleLogin(@Body() creds: GoogleCredentialDto) {
    const ticket = await this.googleService.verifyIdToken({
      idToken: creds.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException();
    }

    const email = payload.email;
    const id = payload.sub;
    const displayName = payload.name;
    const avatar = payload.picture;

    if (!email) {
      throw new UnauthorizedException();
    }

    let user = await this.userModel.findOne({ googleId: id });

    if (!user) {
      user = new this.userModel({
        username: email,
        password: nanoid(),
        googleId: id,
        displayName,
        avatar,
      });
    }

    user.generateToken();
    await user.save();

    return { user };
  }
}
