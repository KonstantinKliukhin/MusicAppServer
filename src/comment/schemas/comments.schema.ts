import { Track } from '../../track/schemas/track.schema';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/schemas/user.schema';

type CommentCreationAttrsType = {
  text: string;
};

@Table({ tableName: 'comment' })
export class Comment extends Model<Comment, CommentCreationAttrsType> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 'Some comment', description: 'Comment' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  text: string;

  @BelongsTo(() => Track)
  track: Track;

  @ForeignKey(() => Track)
  trackId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: number;
}
