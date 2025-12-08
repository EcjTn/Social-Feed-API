import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class EditPostDto {
    @ApiProperty({example: 'I edited my first post! Hello!!'})
    @IsNotEmpty()
    @IsString()
    @Length(1, 500)
    @IsOptional()
    updatedContent?: string

    @ApiProperty({example: false})
    @IsBoolean()
    @IsOptional()
    updatedVisibility?: boolean
}