export interface IHistoryLikedPostsData {
    like_id: number
    post_id: number
    username: string
    avatar: string
    title: string
    content: string
    post_created_at: Date
    liked_at: Date
}

export interface IHistoryLikedPostsResponse {
    likedPosts: IHistoryLikedPostsData[]
    nextCursor: number | null
}

export interface IHistoryCommentData {
    comment_id: number
    post_id: number
    post_title: string
    username: string
    avatar: string
    content: string
    commented_at: Date
}

export interface IHistoryCommentResponse {
    comments: IHistoryCommentData[]
    nextCursor: number | null
}