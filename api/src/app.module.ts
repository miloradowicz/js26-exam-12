import { Module } from '@nestjs/common';
import { MongoModule } from './mongo/mongo.module';
import { CoreModule } from './core/core.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [MongoModule, CoreModule, ImagesModule],
})
export class AppModule {}
