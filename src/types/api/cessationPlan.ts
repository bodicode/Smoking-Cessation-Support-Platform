import { PlanStage } from "./cessationPlanStage";
export interface Plan {
    id: string;
    template: {
        id: string;
        name: string
    };
    reason?: string;
    status?: string;
    start_date: string;
    target_date: string;
    days_since_start?: number;
    completion_percentage?: number;
    is_custom?: boolean;
    is_overdue?: boolean;
    user?: {
        id: string;
        name: string;
    };
    stages: PlanStage[];
}

export interface CessationPlan {
    id: string;
    reason: string;
    start_date: string;
    target_date: string;
    days_to_target: number;
    is_custom: boolean;
    is_overdue: boolean;
    completion_percentage: number;
}
export interface CreateCessationPlanInput {
    template_id: string;
    is_custom: boolean;
    start_date: string;
    target_date: string;
    reason: string;
}

export interface GetCessationPlansOptions {
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: string;
    sortOrder?: string;
    userId?: string;
    templateId?: string;
}

export type CessationPlanStatus = "PLANNING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ABANDONED" | "CANCELLED";

export interface UpdateCessationPlanInput {
    id: string;
    status: CessationPlanStatus;
}
