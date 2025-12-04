import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches, Min, MinLength } from 'class-validator'

export class RegisterUserDto {
    @ApiProperty({example: 'JohnDoe'})
    @IsString()
    @IsNotEmpty()
    @Length(5, 45)
    @Matches(/^[a-zA-Z0-9]+$/, {message: 'username must contain only letters and numbers'})
    readonly username: string

    @ApiProperty({example: '12345678'})
    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'Password is too short(must be above 8 characters).'})
    readonly password: string

    @ApiProperty({example: 'johndoe@gmail.com'})
    @IsString()
    @IsNotEmpty()
    @Length(5, 255)
    @IsEmail()
    email: string

    @ApiProperty({example: 'randomStringGeneratedFromRecaptcha'})
    @IsNotEmpty()
    @IsString()
    recaptchaToken: string
}