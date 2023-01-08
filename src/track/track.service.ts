import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, ObjectId} from "mongoose";
import {Track, TrackDocument} from "./schemas/track.schema";
import {Comment, CommentDocument} from "./schemas/comments.schema";
import {CreateTrackDto} from "./dto/create-track.dto";
import {CreateCommentDto} from "./dto/add-comment.dto";
import {FileService, FileType} from "../file/file.service";


Injectable()
export class TrackService {

    constructor(
        @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        private fileService: FileService
    ) {}

    async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
        const audioPath = await this.fileService.createFile(FileType.AUDIO, audio);
        const picturePath = await this.fileService.createFile(FileType.IMAGE, picture);
        const track = await this.trackModel.create({...dto, listens: 0, audio: audioPath, picture: picturePath});
        return track;
    }

    async getAll(count: number = 10, offset: number = 0): Promise<Track[]> {
        const tracks = await this.trackModel.find().skip(offset).limit(count);

        return tracks;
    }

    async getOne(id: ObjectId): Promise<Track> {
        const track = await this.trackModel.findById(id).populate('comments');

        return track
    }

    async deleteOne(id: ObjectId): Promise<ObjectId> {
        const track = await this.trackModel.findByIdAndDelete(id);
        return track._id;
    }

    async addComment(dto: CreateCommentDto, trackId: ObjectId): Promise<Comment> {
        const track = await this.trackModel.findById(trackId);
        const comment = await this.commentModel.create({...dto, trackId});
        track.comments.push(comment._id);
        await track.save();
        return comment
    }

    async listen(id: ObjectId): Promise<void> {
        const track = await this.trackModel.findById(id);
        track.listens++;
        track.save();
    }

    async search(trackName: string, artistName: string): Promise<Track[]> {
        const tracks = await this.trackModel.find({
            name: {$regex: new RegExp(trackName, 'i')},
            artist: {$regex: new RegExp(artistName, 'i')}
        })

        return tracks;
    }
}