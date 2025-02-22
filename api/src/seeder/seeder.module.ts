import { Module } from '@nestjs/common';
import { MongoModule } from 'src/mongo/mongo.module';
import { SeederService } from './seeder.service';
import { CoreModule } from 'src/core/core.module';
import { SchemasModule } from 'src/schemas/schemas.module';

@Module({
  imports: [MongoModule, CoreModule, SchemasModule],
  providers: [SeederService],
})
export class SeederModule {}
