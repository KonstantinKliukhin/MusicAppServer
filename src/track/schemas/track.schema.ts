import { Comment } from './comments.schema';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

type TrackCreationAttrsType = {
  name: string;
  artist: string;
  picture: string;
  audio: string;
  text?: string;
};

@Table({ tableName: 'track' })
export class Track extends Model<Track, TrackCreationAttrsType> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  artist: string;

  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: false,
    defaultValue: 0,
  })
  listens: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  picture: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  text: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  audio: string;

  @HasMany(() => Comment)
  comments: Comment[];
}
