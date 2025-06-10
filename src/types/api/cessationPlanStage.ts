
export interface PlanStage {
    id: string;
    title: string;
    description?: string;
    actions?: string;
    can_complete?: boolean;
    can_start?: boolean;
    days_since_start?: number;
    days_to_end?: number;
    stage_order?: number;
    is_overdue?: boolean;
    status?: string;
    template_stage_id?: string;
}

export interface CreatePlanStageInput {
    plan_id: string;
    title: string;
    description?: string;
    actions?: string;
    stage_order?: number;
}

export interface UpdatePlanStageInput {
    id: string;
    plan_id: string;
    title?: string;
    description?: string;
    actions?: string;
    stage_order?: number;
}
