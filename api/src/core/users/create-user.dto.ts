import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsMongoDocument } from '../common/class-validators/is-mongo-document';
import { User } from '../schemas/user.schema';
import { IsImage } from '../common/class-validators/is-image';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoDocument(User, 'email', true)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(4)
  password: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsImage()
  avatar: Express.Multer.File;
}
