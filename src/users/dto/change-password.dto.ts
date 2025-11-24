import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({example: '12345678'})
    @IsString()
    @MinLength(8, {message: 'Password is too short(must be above 8 characters).'})
    newPassword: string
}