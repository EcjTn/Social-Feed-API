import { IsNotEmpty, IsNumber, IsString, Length, Matches, Min, MinLength } from 'class-validator'

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 45)
    @Matches(/^[a-zA-Z0-9]+$/, {message: 'username must contain only letters and numbers'})
    readonly username: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'Password is too short(must be above 8 characters).'})
    readonly password: string

    @IsNotEmpty()
    @IsNumber()
    @Min(14, {message: 'Age not allowed(must be 14 or above)'})
    age: number

    @IsNotEmpty()
    @IsString()
    recaptchaToken: string
}