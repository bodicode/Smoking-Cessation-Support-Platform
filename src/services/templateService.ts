
import client from "@/apollo/apolloClient";
import { CREATE_CESSATION_PLAN_TEMPLATE } from "@/graphql/mutations/cessationPlanTemplate/createCessationPlanTemplate";
import { REMOVE_CESSATION_PLAN_TEMPLATE } from "@/graphql/mutations/cessationPlanTemplate/deleteCessationPlanTemplate";
import { UPDATE_CESSATION_PLAN_TEMPLATE } from "@/graphql/mutations/cessationPlanTemplate/updateCessationPlanTemplateMutation";
import { GET_PLAN_TEMPLATE_BY_ID } from "@/graphql/queries/templates/getCessationPlanTemplateById";
import { GET_PLAN_TEMPLATES } from "@/graphql/queries/templates/getPlanTemplates";
import { PlanTemplate, PlanTemplateInput, PlanTemplateUpdateInput } from "@/types/api/cessationPlanTemplate";
import { useQuery } from "@apollo/client";

export async function createPlanTemplate(input: PlanTemplateInput): Promise<PlanTemplate> {
    const { data, errors } = await client.mutate({
        mutation: CREATE_CESSATION_PLAN_TEMPLATE,
        variables: { createCessationPlanTemplateInput: input },
    });

    if (errors && errors.length > 0)
        throw new Error(errors[0].message || "Tạo plan template thất bại");
    return data.createCessationPlanTemplate as PlanTemplate;
}

export function getPlanTemplates({
    page = 1,
    limit = 4,
    search = "",
    orderBy = "created_at",
    sortOrder = "desc",
    filters = {},
}: {
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: string;
    sortOrder?: string;
    filters?: { coachId?: string };
} = {}) {
    const { data, loading, error, refetch } = useQuery(GET_PLAN_TEMPLATES, {
        variables: { page, limit, search, orderBy, sortOrder, filters },
        fetchPolicy: "cache-and-network",
    });

    const templates: PlanTemplate[] = data?.cessationPlanTemplates?.data ?? [];
    const total: number = data?.cessationPlanTemplates?.total ?? 0;
    const hasNext: boolean = data?.cessationPlanTemplates?.hasNext ?? false;
    const totalPages: number = Math.ceil(total / limit);

    return { templates, total, hasNext, totalPages, loading, error, refetch };
}

export async function updatePlanTemplate(input: PlanTemplateUpdateInput): Promise<PlanTemplate> {
    const { data, errors } = await client.mutate({
        mutation: UPDATE_CESSATION_PLAN_TEMPLATE,
        variables: { updateCessationPlanTemplateInput: input },
    });

    if (errors && errors.length > 0)
        throw new Error(errors[0].message || "Cập nhật plan template thất bại");
    return data.updateCessationPlanTemplate as PlanTemplate;
}

export function getPlanTemplateById(id?: string) {
    const { data, loading, error } = useQuery(GET_PLAN_TEMPLATE_BY_ID, {
        variables: { cessationPlanTemplateId: id },
        skip: !id,
        fetchPolicy: "cache-and-network",
    });
    return {
        template: data?.cessationPlanTemplate as PlanTemplate ?? null,
        loading,
        error,
    };
}

export async function removePlanTemplate(id: string): Promise<PlanTemplate> {
    const { data, errors } = await client.mutate({
        mutation: REMOVE_CESSATION_PLAN_TEMPLATE,
        variables: { removeCessationPlanTemplateId: id },
    });

    if (errors && errors.length > 0)
        throw new Error(errors[0].message || "Xóa template thất bại");
    return data?.removeCessationPlanTemplate as PlanTemplate;
}
