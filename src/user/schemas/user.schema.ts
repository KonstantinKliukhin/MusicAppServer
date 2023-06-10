import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

type UserCreationAttrsType = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttrsType> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 'Kostya', description: 'User name' })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'Kostya', description: 'User email' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @ApiProperty({
    example: 's0meStrongP@assword',
    description: 'User password',
  })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  password: string;

  @ApiProperty({
    example: 'image/asd1234asdrv23423.jpg',
    description: 'User avatar',
  })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  avatar: string;
}
