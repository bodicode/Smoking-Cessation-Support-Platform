import client from "@/apollo/apolloClient";
import { CREATE_CESSATION_PLAN } from "@/graphql/mutations/planCessation/createPlanCessation";
import { UPDATE_CESSATION_PLAN } from "@/graphql/mutations/planCessation/updatePlanCessation";
import { GET_CESSATION_PLANS } from "@/graphql/queries/cessationPlan/getCessationPlan";
import { CessationPlan, CreateCessationPlanInput, GetCessationPlansOptions, Plan, UpdateCessationPlanInput } from "@/types/api/cessationPlan";

export async function getCessationPlans({
    page = 1,
    limit = 10,
    search = "",
    orderBy = "created_at",
    sortOrder = "desc",
    userId,
}: GetCessationPlansOptions = {}): Promise<Plan[]> {
    const params: any = { page, limit, search, orderBy, sortOrder };
    const filters: any = {};
    if (userId) filters.user_id = userId;

    const { data, errors } = await client.query({
        query: GET_CESSATION_PLANS,
        variables: { params, filters },
        fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) {
        throw new Error(errors[0].message || "Không lấy được danh sách kế hoạch");
    }
    return data?.cessationPlans?.data || [];
}

export async function createCessationPlan(
    input: CreateCessationPlanInput
): Promise<CessationPlan> {
    const { data, errors } = await client.mutate({
        mutation: CREATE_CESSATION_PLAN,
        variables: { createCessationPlanInput: input },
    });

    if (errors && errors.length > 0)
        throw new Error(errors[0].message || "Tạo kế hoạch thất bại");

    return data.createCessationPlan;
}

export async function updateCessationPlan(input: UpdateCessationPlanInput) {
    const { data, errors } = await client.mutate({
        mutation: UPDATE_CESSATION_PLAN,
        variables: {
            updateCessationPlanInput: input,
        },
        fetchPolicy: "network-only",
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Cập nhật trạng thái kế hoạch thất bại");
    return data.updateCessationPlan;
}