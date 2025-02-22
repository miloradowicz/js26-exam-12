import { Module } from '@nestjs/common';
import { SchemasModule } from 'src/schemas/schemas.module';
import { ImagesController } from './images.controller';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule, SchemasModule],
  controllers: [ImagesController],
})
export class ImagesModule {}
