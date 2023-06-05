import { Track } from './track.schema';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

type CommentCreationAttrsType = {
  name: string;
  username: string;
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

  @ApiProperty({ example: 'Some User name', description: 'User name' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  username: string;

  @BelongsTo(() => Track)
  track: Track;

  @ForeignKey(() => Track)
  userId: number;
}
