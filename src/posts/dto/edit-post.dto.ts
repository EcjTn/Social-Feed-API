import { IsNotEmpty, IsString, Length } from "class-validator";

export class EditPostDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 500)
    updatedContent: string
}