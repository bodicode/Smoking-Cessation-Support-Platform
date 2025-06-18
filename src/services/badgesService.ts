import client from "@/apollo/apolloClient";
import { CREATE_BADGE } from "@/graphql/mutations/badges/createBadgesMutation";
import { UPDATE_BADGE } from "@/graphql/mutations/badges/updateBadgesMutation";
import { GET_BADGES } from "@/graphql/queries/badges/getBadges";
import { GET_MY_AWARDED_BADGES } from "@/graphql/queries/badges/getMyBadge";
import { CreateBadgeInput, GetMyAwardedBadgesParams, MyBadgesFilters, MyBadgesPagination, UpdateBadgeInput } from "@/types/api/badge";

export async function getBadges(params: any = {}, filters: any = {}) {
    const { data, errors } = await client.query({
        query: GET_BADGES,
        variables: { params, filters },
        fetchPolicy: "network-only",
    });
    if (errors) throw new Error(errors[0].message || "Lấy badges thất bại");
    return data.badges;
}

export async function getMyAwardedBadges(
    params: GetMyAwardedBadgesParams = {},
    filters: MyBadgesFilters = {}
): Promise<MyBadgesPagination> {
    const { data, errors } = await client.query<{
        myBadges: MyBadgesPagination;
    }>({
        query: GET_MY_AWARDED_BADGES,
        variables: { params, filters },
        fetchPolicy: "network-only",
    });
    if (errors && errors.length > 0) {
        throw new Error(errors[0].message || "Lấy danh sách badge thất bại");
    }
    return data.myBadges;
}

export async function updateBadge(input: UpdateBadgeInput) {
    const { data, errors } = await client.mutate({
        mutation: UPDATE_BADGE,
        variables: {
            updateBadgeId: input.id,
            updateBadgeInput2: { ...input, id: undefined },
        },
    });
    if (errors?.length) throw new Error(errors[0].message);
    return data.updateBadge;
}


export async function createBadge(input: CreateBadgeInput) {
    const { data, errors } = await client.mutate({
        mutation: CREATE_BADGE,
        variables: { createBadgeInput2: input },
    });
    if (errors?.length) throw new Error(errors[0].message);
    return data.createBadge;
}
