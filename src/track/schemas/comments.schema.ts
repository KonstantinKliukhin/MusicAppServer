import { Track } from './track.schema';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

type CommentCreationAttrsType = {
  name: string;
  username: string;
};

@Table({ tableName: 'comment' })
export class Comment extends Model<Comment, CommentCreationAttrsType> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

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
