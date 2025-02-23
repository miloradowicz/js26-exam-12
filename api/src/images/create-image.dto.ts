import { IsNotEmpty, IsString } from 'class-validator';
import { IsImage } from 'src/core/common/class-validators/is-image';

export class CreateImageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsImage()
  image: Express.Multer.File;
}
