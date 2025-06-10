export interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}
