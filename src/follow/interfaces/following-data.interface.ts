import { IFollowData } from "./follow-data.interface"

export interface IFollowingData extends IFollowData {}

export interface IFollowingDataResponse {
    followings: IFollowingData[]
    nextCursor: number | null
}