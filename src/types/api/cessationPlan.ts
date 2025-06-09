
export type CreateCessationPlanInput = {
    template_id: string;
    is_custom: boolean;
    start_date: string;
    reason: string;
    target_date: string;
};