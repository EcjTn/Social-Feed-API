export interface IFollowersData {
    username: string
    avatar: string | null
    id: number
}

export interface IFollowersDataResponse {
    followers: IFollowersData[]
    nextCursor: number | null
}

export type IFollowingData = IFollowersData
export interface IFollowingDataResponse {
    followings: IFollowingData[]
    nextCursor: number | null
}