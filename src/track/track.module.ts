import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { Track } from './schemas/track.schema';
import { Comment } from './schemas/comments.schema';
import { FileService } from '../file/file.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Track, Comment])],
  controllers: [TrackController],
  providers: [TrackService, FileService],
})
export class TrackModule {}
