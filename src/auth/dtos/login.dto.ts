import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, Length, Matches, Min } from 'class-validator'

export class LoginUserDto {
    @ApiProperty({example: 'JohnDoe'})
    @IsString()
    @IsNotEmpty()
    @Length(5, 45)
    @Matches(/^[a-zA-Z0-9]+$/, {message: 'username must contain only letters and numbers'})
    readonly username: string

    @ApiProperty({example: '12345678'})
    @IsString()
    @IsNotEmpty()
    readonly password: string
}