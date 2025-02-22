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
      user,
      ...(file
        ? {
            image: join('/', 'uploads/images', file.filename),
          }
        : {}),
    });

    return image.depopulate();
  }

  @Get()
  async getAll(@Query('author') author?: string) {
    if (author && !isValidObjectId(author)) {
      throw new ParameterValidationError('ObjectId', author, 'author');
    }

    const filter = author ? { author: new Types.ObjectId(author) } : {};

    const result = await this.imagesModel.find(filter);

    return result;
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
  async togglePublish(@Param('id') id: string, @Principal() user: User) {
    const result = await this.imagesModel.findById(id);

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
