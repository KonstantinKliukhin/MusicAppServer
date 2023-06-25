import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './schemas/comments.schema';
import { UserModule } from '../user/user.module';

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
  imports: [SequelizeModule.forFeature([Comment]), UserModule],
})
export class CommentModule {}
