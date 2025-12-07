import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, Length, Matches } from "class-validator"

export class ProfileDto {

    @ApiProperty({example: 'JohnDoeNew'})
    @IsString()
    @Length(5, 45)
    @IsOptional()
    @Matches(/^[a-zA-Z0-9]+$/, {message: 'username must contain only letters and numbers'})
    readonly newUsername?: string

    @ApiProperty({example: 'This is my new bio!'})
    @IsString()
    @Length(0, 160)
    @IsOptional()
    readonly newBio?: string
}