export interface IComment {
    username: string;
    avatar: string | null;
    id: number;
    content: string;
    createdAt: string;
    repliesCount: number;
    likeCount: number;
    likedByMe: boolean;
}


export interface ICommentsResponse {
    comments: IComment[],
    nextCursor: number | null
}