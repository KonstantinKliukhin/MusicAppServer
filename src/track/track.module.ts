import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { Track } from './schemas/track.schema';
import { FileService } from '../file/file.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentModule } from '../comment/comment.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Track]), CommentModule, AuthModule],
  controllers: [TrackController],
  providers: [TrackService, FileService],
})
export class TrackModule {}
