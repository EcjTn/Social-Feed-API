import { IsNotEmpty, IsNumber, IsString, Length, Matches, Min } from 'class-validator'

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 45)
    @Matches(/^[a-zA-Z0-9]+$/, {message: 'username must contain only letters and numbers'})
    readonly username: string

    @IsString()
    @IsNotEmpty()
    readonly password: string


    @IsNotEmpty()
    @IsString()
    recaptchaToken: string
}