import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Length, Matches, Min, MinLength } from 'class-validator'

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

    @ApiProperty({example: '17'})
    @IsNotEmpty()
    @IsNumber()
    @Min(14, {message: 'Age not allowed(must be 14 or above)'})
    age: number

    @ApiProperty({example: 'randomStringGeneratedFromRecaptcha'})
    @IsNotEmpty()
    @IsString()
    recaptchaToken: string
}