export interface User {
  id: string;
  name: string;
  avatar_url?: string;
}

export interface PostReply {
  id: string;
  content: string;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  created_at?: string;
  replies?: PostReply[];
}

export interface PostComment {
  id: string;
  content: string;
  user: User;
  created_at: string;
  replies: PostReply[];
}

export interface PaginatedCommentsResponse {
  data: PostComment[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export type CreatePostCommentInput = {
  shared_post_id: string;
  content: string;
  parent_comment_id?: string;
};

export type ReplyToCommentInput = {
  shared_post_id: string;
  content: string;
  parent_comment_id: string;
};
