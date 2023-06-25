import { Injectable } from '@nestjs/common';
import { Track } from './schemas/track.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from '../comment/dto/add-comment.dto';
import { FileService, FileType } from '../file/file.service';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from '../comment/schemas/comments.schema';
import { CommentService } from '../comment/comment.service';
import { Op } from 'sequelize';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track) private trackModel: typeof Track,
    private fileService: FileService,
    private commentService: CommentService,
  ) {}

  async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
    const audioPath = await this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = await this.fileService.createFile(
      FileType.IMAGE,
      picture,
    );

    const track = await this.trackModel.create({
      ...dto,
      audio: audioPath,
      picture: picturePath,
    });

    return { ...track.dataValues, comments: [] } as Track;
  }

  async getAll(count = 10, offset = 0): Promise<Track[]> {
    return await this.trackModel.findAll({
      offset,
      limit: count,
      include: ['comments'],
      attributes: [
        'id',
        'name',
        'artist',
        'listens',
        'picture',
        'audio',
        'text',
      ],
    });
  }

  async getOne(id: number): Promise<Track> {
    return await this.trackModel.findOne({
      where: { id },
      include: ['comments'],
      attributes: [
        'id',
        'name',
        'artist',
        'listens',
        'picture',
        'audio',
        'text',
      ],
    });
  }

  async deleteOne(id: number): Promise<number> {
    const track = await this.trackModel.findOne({ where: { id } });
    await track.destroy();
    await this.fileService.removeFile(FileType.IMAGE, track.picture);
    await this.fileService.removeFile(FileType.AUDIO, track.audio);
    return id;
  }

  async addComment(
    dto: CreateCommentDto,
    userId: number,
    trackId: number,
  ): Promise<Comment> {
    const track = await this.trackModel.findOne({
      include: ['comments'],
      where: {
        id: trackId,
      },
    });
    const comment = await this.commentService.addComment(Number(userId), dto);
    await comment.$set('track', [trackId]);
    track.comments.push(comment);
    await track.save();
    return comment;
  }

  async listen(id: number): Promise<void> {
    const track = await this.trackModel.findOne({ where: { id } });
    track.listens++;
    track.save();
  }

  async search(trackName = '', artistName = ''): Promise<Track[]> {
    return await this.trackModel.findAll({
      where: {
        [Op.and]: [
          {
            name: {
              [Op.like]: `%${trackName}%`,
            },
          },
          {
            artist: {
              [Op.like]: `%${artistName}%`,
            },
          },
        ],
      },
      include: ['comments'],
      attributes: [
        'id',
        'name',
        'artist',
        'listens',
        'picture',
        'audio',
        'text',
      ],
    });
  }
}
