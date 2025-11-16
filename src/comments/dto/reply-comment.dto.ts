import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { CommentDto } from "./comment.dto";

export class ReplyCommentDto extends CommentDto {
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    parent_id: number
}