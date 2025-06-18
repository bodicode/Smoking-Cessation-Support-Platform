export interface BadgeType {
    id: string;
    name: string;
}

export interface Badge {
    id: string;
    icon_url: string;
    name: string;
    description: string;
    requirements: string;
    sort_order: number;
    badge_type: BadgeType;
}

export interface MyBadge {
    id: string;
    awarded_at: string;
    badge: Badge;
}

export interface MyBadgesPagination {
    data: MyBadge[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
}

export interface BadgesResponse {
    data: Badge[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
}

export interface MyBadgesResponse {
    data: {
        myBadges: MyBadgesPagination;
    };
}

export interface GetMyAwardedBadgesParams {
    page?: number;
    limit?: number;
}

export interface MyBadgesFilters {
    name?: string;
}

export interface UpdateBadgeInput {
    id: string;
    name?: string;
    description?: string;
    sort_order?: number;
    icon_url?: string;
    badge_type_id?: string;
    requirements?: string;
}

export interface CreateBadgeInput {
    name: string;
    description: string;
    sort_order: number;
    icon_url: string;
    badge_type_id: string;
    requirements?: string;
}


