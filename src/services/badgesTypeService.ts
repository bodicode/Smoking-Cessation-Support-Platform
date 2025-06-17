import { GET_BADGE_TYPES } from "@/graphql/queries/badgesType/getBadgesType";
import { useQuery } from "@apollo/client";

export function useBadgeTypes() {
    const { data, loading, error } = useQuery(GET_BADGE_TYPES);
    return {
        badgeTypes: data?.badgeTypes?.data ?? [],
        loading,
        error
    };
}