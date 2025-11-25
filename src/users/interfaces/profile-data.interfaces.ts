import { UserRole } from "src/common/enums/user-role.enum"

export interface IProfileData {
    id: number
    username: string
    avatar: string | null
    role: UserRole.User | UserRole.Moderator | UserRole.Admin
    isBanned: boolean
    bio: string | null
    postCount: number   
    followerCount: number
    followingCount: number
}

export interface IProfileDataPublic extends IProfileData {
    followedByMe: boolean
}

export interface IUserSearchData {
    id: number
    username: string
    avatar: string | null
}