export interface IFollowData {
    username: string
    id: number
}

export interface IFollowDataResponse {
    followers: IFollowData[]
    nextCursor: number | null
}