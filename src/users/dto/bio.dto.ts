import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class BioDto {
    @ApiProperty({example: 'This is my bio'})
    @IsString()
    @IsNotEmpty()
    @Length(1, 300)
    bio: string
}