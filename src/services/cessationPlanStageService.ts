import client from "@/apollo/apolloClient";
import { UPDATE_PLAN_STAGE } from "@/graphql/mutations/planCessationStage/updatePlanCessationStage";
import { CREATE_PLAN_STAGE } from "@/graphql/mutations/planCessationStage/createPlanCessationStage";
import { REMOVE_PLAN_STAGE } from "@/graphql/mutations/planCessationStage/removePlanCessationStage";
import { GET_PLAN_STAGE_CHARTS } from "@/graphql/queries/processRecord/getPlanStageChart";

export async function createPlanStage(input: any) {
    const { data, errors } = await client.mutate({
        mutation: CREATE_PLAN_STAGE,
        variables: { input },
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Tạo giai đoạn thất bại");
    return data.createPlanStage;
}

export async function updatePlanStage(input: any) {
    const { data, errors } = await client.mutate({
        mutation: UPDATE_PLAN_STAGE,
        variables: { input },
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Cập nhật giai đoạn thất bại");
    return data.updatePlanStage;
}

export async function removePlanStage(id: string) {
    const { data, errors } = await client.mutate({
        mutation: REMOVE_PLAN_STAGE,
        variables: { removePlanStageId: id },
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Xoá giai đoạn thất bại");
    return data.removePlanStage;
}

export async function getPlanStageCharts(planId: string, filters?: any) {
    const { data, errors } = await client.query({
        query: GET_PLAN_STAGE_CHARTS,
        variables: { planId, filters },
        fetchPolicy: "no-cache"
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Không thể lấy dữ liệu chart");
    return data.planStageChartsData;
}