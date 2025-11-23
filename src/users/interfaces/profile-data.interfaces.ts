import { UserRole } from "src/common/enums/user-role.enum"

export interface IProfileData {
    username: string
    role: UserRole.User | UserRole.Moderator | UserRole.Admin
    isBanned: boolean
    bio: string | null
    postCount: number
    followerCount: number
    followingCount: number
}

//TODO: add followedByMe boolean after service implementation
export interface IPublicProfileData extends IProfileData {}