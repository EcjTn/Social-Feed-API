import { IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @MinLength(8, {message: 'Password is too short(must be above 8 characters).'})
    newPassword: string
}