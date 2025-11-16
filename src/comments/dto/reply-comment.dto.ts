import { IsNotEmpty, IsString, Length } from "class-validator";

export class ReplyCommentDto {

    @IsString()
    @IsNotEmpty()
    @Length(1, 200)
    content: string

}