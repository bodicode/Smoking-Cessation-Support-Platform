import client from "@/apollo/apolloClient";
import { CREATE_FEEDBACK } from "@/graphql/mutations/feedbackPlanTemplate/createFeedbackPlanTemplate";
import { REMOVE_FEEDBACK } from "@/graphql/mutations/feedbackPlanTemplate/deleteFeedbackPlanTemplate";
import { UPDATE_FEEDBACK } from "@/graphql/mutations/feedbackPlanTemplate/updateFeedbackPlanTemplate";
import { GET_FEEDBACKS } from "@/graphql/queries/feedbacks/getFeedbacksByTemplateId";
import { CreateFeedbackInput, FeedbackFilters, GetFeedbacksInput } from "@/types/api/feedbackPlanTemplate";

export async function createFeedback(input: CreateFeedbackInput) {
    const { data, errors } = await client.mutate({
        mutation: CREATE_FEEDBACK,
        variables: {
            createFeedbackInput2: input,
        },
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Gửi feedback thất bại");
    return data.createFeedback;
}
export async function getFeedbacks({
    params,
    filters
}: GetFeedbacksInput) {
    const { data, errors } = await client.query({
        query: GET_FEEDBACKS,
        variables: {
            ...(params ? { params } : {}),
            ...(filters ? { filters } : {}),
        },
        fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) throw new Error(errors[0].message || "Không thể lấy feedback");
    return data.feedbacks?.data || [];
}

export async function updateFeedback(id: string, input: { rating: number; content: string;}) {
    const { data, errors } = await client.mutate({
        mutation: UPDATE_FEEDBACK,
        variables: {
            updateFeedbackId: id,
            updateFeedbackInput2: input,
        },
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Cập nhật feedback thất bại");
    return data.updateFeedback;
}

export async function removeFeedback(id: string) {
    const { data, errors } = await client.mutate({
        mutation: REMOVE_FEEDBACK,
        variables: { removeFeedbackId: id },
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Xóa feedback thất bại");
    return data.removeFeedback;
}