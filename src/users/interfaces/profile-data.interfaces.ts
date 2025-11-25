import { UserRole } from "src/common/enums/user-role.enum"

export interface IProfileData {
    username: string
    avatar: string | null
    followedByMe?: boolean
    role: UserRole.User | UserRole.Moderator | UserRole.Admin
    isBanned: boolean
    bio: string | null
    postCount: number
    followerCount: number
    followingCount: number
}