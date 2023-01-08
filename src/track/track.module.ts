import {Module} from "@nestjs/common";
import {TrackController} from "./track.controller";
import {TrackService} from "./track.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Track, TrackShema} from "./schemas/track.schema";
import {Comment, CommentShema} from "./schemas/comments.schema";
import {FileService} from "../file/file.service";


@Module({
    imports: [
        MongooseModule.forFeature([{name: Track.name, schema: TrackShema}]),
        MongooseModule.forFeature([{name: Comment.name, schema: CommentShema}]),
    ],
    controllers: [TrackController],
    providers: [TrackService, FileService],
})
export class TrackModule {

}