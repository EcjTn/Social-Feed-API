export interface PublicPost {
    username: string
    id: number
    title: string
    content: string
    created_at: Date
    commentCount: number
    likeCount: number
}

export interface PublicPostsResponse {
    posts: PublicPost[]
    nextCursor: number | null
}