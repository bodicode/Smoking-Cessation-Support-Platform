export type PaginationParamsInput = {
    page?: number;
    limit?: number;
};

export type SharedPostFiltersInput = {
    userId?: string;
    badgeId?: string;
};

export type User = {
    id: string;
    name: string;
    avatar_url: string | null;
};

export type Badge = {
    name: string;
    icon_url: string;
};

export type UserBadge = {
    user: User;
    badge: Badge;
};

export type Comment = {
    id: string;
    text: string;
    user?: {
        name: string;
    };
};

export type Post = {
    id: string;
    caption: string;
    user_badge: UserBadge;
    likes_count: number;
    comments_count: number;
    created_at: string;
    liked?: boolean;
    comments?: Comment[];
};

export type SharedPostsResponse = {
    data: Post[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
};

export type CreateSharedPostInput = {
    user_badge_id: string;
    caption: string;
};

export type UpdateSharedPostInput = {
    caption: string;
};
