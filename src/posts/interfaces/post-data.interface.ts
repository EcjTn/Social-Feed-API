export interface IPostData {
    username: string
    avatar: string | null
    id: number
    title: string
    content: string
    created_at: Date
    commentCount: number
    likeCount: number
    likedByMe?: boolean
}

export interface IPostDataResponse {
    posts: IPostData[]
    nextCursor: number | null
}