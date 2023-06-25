import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './schemas/track.schema';
import { CreateCommentDto } from '../comment/dto/add-comment.dto';
import { Comment } from '../comment/schemas/comments.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTokenUser } from '../auth';
import TokenUser from '../models/TokenUser';
import { JwtAuthGuard } from '../auth';

@ApiTags('tracks')
@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @ApiOperation({ summary: 'Creates track' })
  @ApiResponse({ status: 200, type: Track })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles()
    {
      picture,
      audio,
    }: { picture: Express.Multer.File; audio: Express.Multer.File },
    @Body() dto: CreateTrackDto,
  ) {
    return this.trackService.create(dto, picture[0], audio[0]);
  }

  @ApiOperation({ summary: 'Returns all tracks' })
  @ApiResponse({ status: 200, type: [Track] })
  @Get()
  getAll(@Query('count') count: number, @Query('offset') offset: number) {
    return this.trackService.getAll(count, offset);
  }

  @ApiOperation({ summary: 'finds track by track name or/and artist name' })
  @ApiResponse({ status: 200, type: [Track] })
  @Get('/search')
  search(
    @Query('track_name') trackName?: string,
    @Query('artist_name') artistName?: string,
  ): Promise<Track[]> {
    return this.trackService.search(trackName, artistName);
  }

  @ApiOperation({ summary: 'adds comment to track' })
  @ApiResponse({ status: 200, type: [Comment] })
  @UseGuards(JwtAuthGuard)
  @Post('/:id/comment')
  addComment(
    @Param('id') trackId: string,
    @Body() dto: CreateCommentDto,
    @GetTokenUser() user: TokenUser | null,
  ): Promise<Comment> {
    return this.trackService.addComment(dto, Number(user.id), Number(trackId));
  }

  @ApiOperation({ summary: 'adds 1 listen to track' })
  @ApiResponse({ status: 200 })
  @Post('/listen/:id')
  listen(@Param('id') id: string): Promise<void> {
    return this.trackService.listen(Number(id));
  }

  @ApiOperation({ summary: 'returns 1 track' })
  @ApiResponse({ status: 200, type: Track })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Track> {
    return this.trackService.getOne(Number(id));
  }

  @ApiOperation({ summary: 'deletes track' })
  @ApiResponse({ status: 200, type: Track })
  @Delete(':id')
  deleteOne(@Param('id') id: string): Promise<number> {
    return this.trackService.deleteOne(Number(id));
  }
}
