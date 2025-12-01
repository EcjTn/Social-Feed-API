import { IsEnum } from "class-validator";
import { UserRole } from "src/common/enums/user-role.enum";

export class SetRoleDto {
    @IsEnum(UserRole, { message: 'role must be a valid role(admin, moderator, user).' })
    role: UserRole;
}