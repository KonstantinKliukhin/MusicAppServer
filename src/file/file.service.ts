import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
}

@Injectable()
export class FileService {
  async createFile(type: FileType, file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid() + '.' + fileExtension;
      const filePath = path.resolve(__dirname, '..', 'static', type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      await fs.writeFile(
        path.resolve(filePath, fileName),
        file.buffer,
        () => 'mock',
      );

      return type + '/' + fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeFile(type: FileType, fileName: string): Promise<string> {
    const filePath = path.resolve(__dirname, '..', 'static', type);

    try {
      await fs.unlink(path.resolve(filePath, fileName), () => 'mock');
      return fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
