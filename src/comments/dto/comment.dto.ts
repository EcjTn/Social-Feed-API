import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString, Length } from "class-validator";

export class CommentDto {

    @ApiProperty({example: 'Hey there! How are you?'})
    @IsString()
    @IsNotEmpty()
    @Length(1, 200)
    content: string

}