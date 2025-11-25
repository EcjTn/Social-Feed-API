export interface IFollowData {
    username: string
    avatar: string | null
    id: number
}

export interface IFollowDataResponse {
    followers: IFollowData[]
    nextCursor: number | null
}