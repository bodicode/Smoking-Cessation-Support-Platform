export interface BlogInput {
    title: string;
    content: string;
    coverImage?: File | null;
}
export interface BlogUpdateInput extends BlogInput {
    id: string;
}
export interface Blog {
    id: string;
    title: string;
    content: string;
    slug: string;
    cover_image?: string;
    created_at?: string;
    updated_at?: string;
}
export interface BlogList {
    data: Blog[];
    total: number;
    hasNext?: boolean;
}
