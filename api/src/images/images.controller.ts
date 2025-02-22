import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { isValidObjectId, Model, Types } from 'mongoose';
import { join } from 'path';
import config from 'src/config';
import { Auth } from 'src/core/common/auth/auth.decorator';
import { useStorage } from 'src/core/common/storage/storage';
import { Image } from 'src/schemas/image.schema';
import { CreateImageDto } from './create-image.dto';
import { Principal } from 'src/core/common/principal/principal.param-decorator';
import { User } from 'src/core/schemas/user.schema';
import { ParameterValidationError } from 'src/exception-filters/parameter-validation-error.filter';

@Controller('images')
export class ImagesController {
  constructor(
    @InjectModel(Image.name) private readonly imagesModel: Model<Image>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Auth('user', 'admin')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: useStorage(
        join(config.rootPath, config.publicPath, 'uploads/images'),
      ),
    }),
  )
  async create(
    @Body() imageDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Principal() user: User,
  ) {
    const image = await this.imagesModel.create({
      ...imageDto,
      author: user,
      ...(file
        ? {
            image: join('/', 'uploads/images', file.filename),
          }
        : {}),
    });

    return image.depopulate();
  }

  @Get()
  async getAll(@Query('author') id?: string) {
    if (id && !isValidObjectId(id)) {
      throw new ParameterValidationError('ObjectId', id, 'author');
    }

    let filter = {};
    let result = {};
    if (id) {
      filter = { author: new Types.ObjectId(id) };

      const author = await this.userModel.findById(id);
      if (author) {
        result = { title: author.displayName };
      } else {
        result = { title: 'Unknown author' };
      }
    }

    const images = await this.imagesModel
      .find(filter)
      .populate('author', { username: 0, avatar: 0, role: 0, token: 0 });

    return { ...result, images };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const result = await this.imagesModel.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @Auth('user', 'admin')
  @Delete(':id')
  async delete(@Param('id') id: string, @Principal() user: User) {
    const result = await this.imagesModel
      .findById(id)
      .populate('author', { username: 0, avatar: 0, token: 0 });

    if (!result) {
      throw new NotFoundException();
    }

    if (user.role === 'admin' || user.role === result.author.role) {
      await result.deleteOne();
    } else {
      throw new ForbiddenException();
    }

    return null;
  }
}
