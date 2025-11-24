import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class EditPostDto {
    @ApiProperty({example: 'I edited my first post! Hello!!'})
    @IsNotEmpty()
    @IsString()
    @Length(1, 500)
    updatedContent: string
}