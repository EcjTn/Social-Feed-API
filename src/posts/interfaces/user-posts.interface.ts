export interface UserPost {
    id: number
    title: string
    content: string
    created_at: Date
    likes: number
}

export interface UserPostsResponse {
    posts: UserPost[];
    nextCursor: number | null
}