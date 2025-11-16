import { IsNotEmpty, IsNumber, IsPositive, IsString, Length } from "class-validator";

export class CommentDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    post_id: number

    @IsString()
    @IsNotEmpty()
    @Length(1, 200)
    content: string

}