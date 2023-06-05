import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

const bootstrap = async () => {
  const logger = new Logger(bootstrap.name);

  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      credentials: true,
    });
    app.use(cookieParser());

    const config = new DocumentBuilder()
      .setTitle('Music APP')
      .setDescription('REST API wrote with NestJS')
      .setVersion('1.0.0')
      .addTag('IN DEVELOP')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    app.listen(PORT, () => logger.log(`server started on PORT ${PORT}`));
  } catch (e) {
    logger.error(e);
  }
};

bootstrap();
