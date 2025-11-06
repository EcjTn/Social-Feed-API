import { IsNotEmpty, IsString, Length } from "class-validator";

export class BioDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 300)
    bio: string
}