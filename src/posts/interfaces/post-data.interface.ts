export interface PostData {
    username: string
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