import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { UserRole } from "src/common/enums/user-role.enum";

export class SetRoleDto {
    @ApiProperty({ enum: UserRole, description: 'The role to be assigned to the user.' })
    @IsEnum(UserRole, { message: 'role must be a valid role(admin, moderator, user).' })
    role: UserRole;
}