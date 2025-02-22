import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import config from 'src/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import {
  DtoValidationError,
  DtoValidationErrorFilter,
} from './exception-filters/dto-validation-error.filter';
import { CastErrorFilter } from './exception-filters/mongo-cast-error.filter';
import { ValidationErrorFilter } from './exception-filters/mongo-validation-error.filter';
import { ParameterValidationErrorFilter } from './exception-filters/parameter-validation-error.filter';
import { NotFoundExceptionFilter } from './exception-filters/not-found-error.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.useStaticAssets(join(config.rootPath, config.publicPath));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[]) => {
        throw new DtoValidationError(validationErrors);
      },
    }),
  );
  app.useGlobalFilters(
    new CastErrorFilter(),
    new ValidationErrorFilter(),
    new DtoValidationErrorFilter(),
    new ParameterValidationErrorFilter(),
    new NotFoundExceptionFilter(),
  );
  await app.listen(config.server.port);
}
bootstrap().catch(console.error);
