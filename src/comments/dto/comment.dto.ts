import { IsNotEmpty, IsNumber, IsPositive, IsString, Length } from "class-validator";

export class CommentDto {

    @IsString()
    @IsNotEmpty()
    @Length(1, 200)
    content: string

}