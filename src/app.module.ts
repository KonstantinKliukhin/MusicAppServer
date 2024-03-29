import { Module } from '@nestjs/common';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { Track } from './track/schemas/track.schema';
import { Comment } from './comment/schemas/comments.schema';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Track, Comment, User],
      autoLoadModels: true,
    }),
    TrackModule,
    FileModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
