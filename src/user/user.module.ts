import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { FileService } from '../file/file.service';

@Module({
  controllers: [UserController],
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [UserService, FileService],
  exports: [UserService],
})
export class UserModule {}
