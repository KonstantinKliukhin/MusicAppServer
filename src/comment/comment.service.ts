import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './schemas/comments.schema';
import { CreateCommentDto } from './dto/add-comment.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentModel: typeof Comment,
    private userService: UserService,
  ) {}

  async addComment(userId: number, comment: CreateCommentDto) {
    const user = await this.userService.getOne(userId);
    if (!user) throw new HttpException("User isn't found", 404);
    const dbComment = await this.commentModel.create({ text: comment.text });

    await dbComment.$set('user', [userId]);

    await dbComment.save();

    return dbComment;
  }
}
