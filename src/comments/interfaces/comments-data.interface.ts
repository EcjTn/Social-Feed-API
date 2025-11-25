export interface Comment {
    username: string;
    avatar: string | null;
    id: number;
    content: string;
    createdAt: string;
    repliesCount: number;
    likeCount: number;
}


export interface CommentsResponse {
    comments: Comment[],
    nextCursor: number | null
}