export interface PlanStageInput {
    title: string;
    description: string;
    recommended_actions?: string;
    duration_days: number;
    stage_order: number;
    template_id: string;
}

export interface PlanStageUpdateInput extends PlanStageInput {
    id: string;
}
export interface PlanStage {
    id: string;
    template: { id: string };
    title: string;
    description: string;
    recommended_actions: string;
    duration_days: number;
    stage_order: number;
}
