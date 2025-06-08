export interface PlanTemplateInput {
    name: string;
    description: string;
    difficulty_level: "EASY" | "MEDIUM" | "HARD";
    estimated_duration_days: number;
}

export interface PlanTemplateUpdateInput extends PlanTemplateInput {
    id: string;
}

export interface PlanTemplate {
    id: string;
    name: string;
    description: string;
    difficulty_level: "EASY" | "MEDIUM" | "HARD";
    estimated_duration_days: number;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
}

export interface PlanTemplateList {
    data: PlanTemplate[];
    total: number;
    hasNext: boolean;
}
