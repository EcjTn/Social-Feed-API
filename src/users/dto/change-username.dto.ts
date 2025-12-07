import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class ChangeUsernameDto {
    @ApiProperty({example: 'new_username123'})
    @IsString()
    @Length(5, 45)
    newUsername: string;
}