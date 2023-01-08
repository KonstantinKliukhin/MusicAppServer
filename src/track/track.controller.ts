import {Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors} from "@nestjs/common";
import {TrackService} from "./track.service";
import {CreateTrackDto} from "./dto/create-track.dto";
import {ObjectId} from "mongoose";
import {Track} from "./schemas/track.schema";
import {CreateCommentDto} from "./dto/add-comment.dto";
import {Comment} from "./schemas/comments.schema";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {Express} from "express";


@Controller('/tracks')
export class TrackController {
    constructor(private trackService: TrackService) {
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'picture', maxCount: 1},
        {name: 'audio', maxCount: 1},
    ]))
    create(@UploadedFiles() {
        picture,
        audio
    }: { picture: Express.Multer.File, audio: Express.Multer.File }, @Body() dto: CreateTrackDto) {
        return this.trackService.create(dto, picture[0], audio[0]);
    }

    @Get()
    getAll(
        @Query('count') count: number,
        @Query('offset') offset: number
    ) {
        return this.trackService.getAll(count, offset);
    }

    @Get('/search')
    search(@Query('track_name') trackName: string, @Query('artist_name') artistName: string) {
        return this.trackService.search(trackName, artistName);
    }

    @Post('/:id/comment')
    addComment(@Param('id')trackId: ObjectId, @Body() dto: CreateCommentDto): Promise<Comment> {
        return this.trackService.addComment(dto, trackId);
    }

    @Post('/listen/:id')
    listen(@Param('id') id: ObjectId): Promise<void> {
        return this.trackService.listen(id);
    }

    @Get(':id')
    getOne(@Param('id') id: ObjectId): Promise<Track> {
        return this.trackService.getOne(id);
    }

    @Delete(':id')
    deleteOne(@Param('id') id: ObjectId): Promise<ObjectId> {
        return this.trackService.deleteOne(id);
    }
}