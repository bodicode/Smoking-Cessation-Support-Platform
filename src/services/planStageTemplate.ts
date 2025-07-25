import client from "@/apollo/apolloClient";
import { CREATE_PLAN_STAGE_TEMPLATE } from "@/graphql/mutations/planStageTemplate/createPlanStageTemplate";
import { DELETE_PLAN_STAGE_TEMPLATE } from "@/graphql/mutations/planStageTemplate/deletePlanStageTemplate";
import { UPDATE_PLAN_STAGE_TEMPLATE } from "@/graphql/mutations/planStageTemplate/updatePlanStageTemplate";
import { GET_PLAN_STAGE_TEMPLATES_BY_TEMPLATE } from "@/graphql/queries/templates/getPlanStageTemplateByTemplate";
import { PlanStage, PlanStageInput } from "@/types/api/planStageTemplate";
import { useLazyQuery, useQuery } from "@apollo/client";

export async function createPlanStage(input: PlanStageInput): Promise<PlanStage> {
    const inputWithSnakeCase = {
        ...input,
        template_id: input.template_id,
        max_cigarettes_per_day: input.max_cigarettes_per_day,
    };
    delete (inputWithSnakeCase as any).templateId;

    const { data, errors } = await client.mutate<{ createPlanStageTemplate: PlanStage }>({
        mutation: CREATE_PLAN_STAGE_TEMPLATE,
        variables: { createPlanStageTemplateInput: inputWithSnakeCase },
    });
    if (errors && errors.length > 0)
        throw new Error(errors[0].message || "Tạo stage thất bại");
    return data!.createPlanStageTemplate;
}

export function usePlanStages(templateId: string) {
    const { data, loading, error, refetch } = useQuery(GET_PLAN_STAGE_TEMPLATES_BY_TEMPLATE, {
        variables: { templateId },
        skip: !templateId,
        fetchPolicy: "cache-and-network",
    });
    const stages = data?.planStageTemplates?.data ?? [];
    return { stages, loading, error, refetch };
}

export async function updatePlanStage(input: any) {
    const { data, errors } = await client.mutate({
        mutation: UPDATE_PLAN_STAGE_TEMPLATE,
        variables: { updatePlanStageTemplateInput: input },
    });
    if (errors && errors.length > 0)
        throw new Error(errors[0].message || "Cập nhật thất bại");
    return data.updatePlanStageTemplate;
}

export async function deletePlanStage(id: string) {
    const { data, errors } = await client.mutate({
        mutation: DELETE_PLAN_STAGE_TEMPLATE,
        variables: { removePlanStageTemplateId: id },
    });
    if (errors && errors.length > 0)
        throw new Error(errors[0].message || "Xóa thất bại");
    return data.removePlanStageTemplate;
}

export function useLazyPlanStages() {
    const [fetchStages, { data, loading, error }] = useLazyQuery(GET_PLAN_STAGE_TEMPLATES_BY_TEMPLATE);
    const stages = data?.planStageTemplates?.data ?? [];
    return { fetchStages, stages, loading, error };
}
