export interface PlanTemplateInput {
    name: string;
    description: string;
    difficulty_level: "EASY" | "MEDIUM" | "HARD";
    estimated_duration_days: number;
}

export interface PlanTemplateUpdateInput extends PlanTemplateInput {
    id: string;
}
export interface PlanTemplateStage {
    id: string;
    stage_order: number;
    title: string;
    description: string;
    recommended_actions?: string;
    duration_days: number;
}

export interface PlanTemplateCoach {
    id: string;
    name: string;
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
    total_reviews?: number;
    success_rate?: number;
    average_rating?: number;
    coach?: PlanTemplateCoach;
    stages?: PlanTemplateStage[];
}

export interface PlanTemplateList {
    data: PlanTemplate[];
    total: number;
    hasNext: boolean;
}
