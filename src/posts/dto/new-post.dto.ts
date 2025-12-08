import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator"

export class NewPostDto {

    @ApiProperty({example: 'My first post'})
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    title: string

    @ApiProperty({example: 'This is my first post! Hello world! I am learning NestJS!'})
    @IsString()
    @IsNotEmpty()
    @Length(1, 500)
    content: string

    @ApiProperty({example: false})
    @IsBoolean()
    @IsOptional()
    isPrivate?: boolean

}