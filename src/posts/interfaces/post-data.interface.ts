export interface PostData {
    username: string
    avatar: string | null
    id: number
    title: string
    content: string
    created_at: Date
    commentCount: number
    likeCount: number
}

export interface PostDataResponse {
    posts: PostData[]
    nextCursor: number | null
}