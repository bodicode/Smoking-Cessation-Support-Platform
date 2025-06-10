import client from "@/apollo/apolloClient";
import { CREATE_CESSATION_PLAN } from "@/graphql/mutations/planCessation/createPlanCessation";
import { GET_CESSATION_PLANS } from "@/graphql/queries/cessationPlan/getCessationPlan";
import { CessationPlan, CreateCessationPlanInput, Plan } from "@/types/api/cessationPlan";

export async function getCessationPlans(): Promise<Plan[]> {
    const { data, errors } = await client.query({
        query: GET_CESSATION_PLANS,
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