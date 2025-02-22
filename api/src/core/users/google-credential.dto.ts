import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleCredentialDto {
  @IsNotEmpty()
  @IsString()
  credential: string;
}
