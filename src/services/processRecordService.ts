import client from "@/apollo/apolloClient";
import { CREATE_PROGRESS_RECORD } from "@/graphql/mutations/processRecord/createProcessRecordMutation";
import { REMOVE_PROGRESS_RECORD } from "@/graphql/mutations/processRecord/deleteProcessRecordMutation";
import { UPDATE_PROGRESS_RECORD } from "@/graphql/mutations/processRecord/updateProcessRecordMutation";
import { GET_PROGRESS_RECORDS } from "@/graphql/queries/processRecord/getProcessRecord";

export async function getProgressRecords({ planId, page = 1, limit = 20 }: { planId: string, page?: number, limit?: number }) {
    const { data, errors } = await client.query({
        query: GET_PROGRESS_RECORDS,
        variables: {
            params: {
                page,
                limit,
                orderBy: "record_date",
                sortOrder: "desc",
                search: "",
            },
            filters: {
                planId,
            }
        },
        fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) throw new Error(errors[0].message || "Không thể lấy progress records");
    return {
        records: data.progressRecords?.data || [],
        totalMoneySaved: data.progressRecords?.total_money_saved ?? 0,
    };
}

export async function createProgressRecord(input: any) {
    const { data, errors } = await client.mutate({
        mutation: CREATE_PROGRESS_RECORD,
        variables: { createProgressRecordInput2: input },
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Không tạo được record");
    return data?.createProgressRecord;
}

export async function updateProgressRecord(input: any) {
    const { data, errors } = await client.mutate({
        mutation: UPDATE_PROGRESS_RECORD,
        variables: { updateProgressRecordInput2: input },
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Cập nhật ghi nhận thất bại");
    return data.updateProgressRecord;
}

export async function removeProgressRecord(id: string) {
    const { data, errors } = await client.mutate({
        mutation: REMOVE_PROGRESS_RECORD,
        variables: { removeProgressRecordId: id },
    });
    if (errors && errors.length > 0) throw new Error(errors[0].message || "Xóa ghi nhận thất bại");
    return data.removeProgressRecord;
}