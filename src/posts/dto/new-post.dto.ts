import { IsNotEmpty, IsString, Length } from "class-validator"

export class NewPostDto {

    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    title: string

    @IsString()
    @IsNotEmpty()
    @Length(1, 500)
    content: string

}