import { Comment } from '../../comment/schemas/comments.schema';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

type TrackCreationAttrsType = {
  name: string;
  artist: string;
  picture: string;
  audio: string;
  text?: string;
};

@Table({ tableName: 'track' })
export class Track extends Model<Track, TrackCreationAttrsType> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 'Some track name', description: 'Track name' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'Some track artist', description: 'Track artist' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  artist: string;

  @ApiProperty({ example: 22, description: 'Track listens count' })
  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: false,
    defaultValue: 0,
  })
  listens: number;

  @ApiProperty({
    example: 'image/asd1234asdrv23423.jpg',
    description: 'Track image url',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  picture: string;

  @ApiProperty({
    example: 'Some text of track',
    description: 'Track text',
  })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  text: string;

  @ApiProperty({
    example: 'audio/asd1234asdrv23423.mp3',
    description: 'Track audio url',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  audio: string;

  @ApiProperty({
    type: [Comment],
    description: 'Track comments',
  })
  @HasMany(() => Comment)
  comments: Comment[];
}
