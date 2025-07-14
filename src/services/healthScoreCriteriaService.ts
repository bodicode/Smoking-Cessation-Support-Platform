import { CREATE_HEALTH_SCORE_CRITERIA_MUTATION } from "@/graphql/mutations/healthScoreCriteria/createHealthScoreCriteria";
import { UPDATE_HEALTH_SCORE_CRITERIA_MUTATION } from "@/graphql/mutations/healthScoreCriteria/updateHealthScoreCriteria";
import { GET_HEALTH_SCORE_CRITERIA_QUERY } from "@/graphql/queries/healthScoreCriteria/getHealthScoreCriteria";
import { GetHealthScoreCriteriaData } from "@/types/api/healthScoreCriteria";
import { useMutation, useQuery, ApolloError } from "@apollo/client";

export const useHealthScoreCriteria = (coachId: string | null) => {
  const { loading, error, data, refetch } =
    useQuery<GetHealthScoreCriteriaData>(GET_HEALTH_SCORE_CRITERIA_QUERY, {
      variables: { coachId },
      skip: !coachId,
    });

  const [createCriteria] = useMutation(CREATE_HEALTH_SCORE_CRITERIA_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      throw err;
    },
  });

  const [updateCriteria] = useMutation(UPDATE_HEALTH_SCORE_CRITERIA_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      throw err;
    },
  });

  const handleCreate = async (input: {
    title: string;
    description: string;
  }) => {
    try {
      const { data } = await createCriteria({
        variables: {
          createHealthScoreCriteriaInput2: {
            title: input.title,
            description: input.description,
          },
        },
      });
      return data?.createHealthScoreCriteria;
    } catch (err: any) {
      if (
        err instanceof ApolloError &&
        err.message.includes(
          "Each coach can only create one health score criteria"
        )
      ) {
        throw new Error(
          "Bạn đã có bảng tiêu chí rồi. Vui lòng cập nhật cái hiện có."
        );
      }

      throw new Error(err.message || "Tạo tiêu chí thất bại!");
    }
  };

  const handleUpdate = async (
    id: string,
    input: { title: string; description: string }
  ) => {
    try {
      const { data } = await updateCriteria({
        variables: {
          updateHealthScoreCriteriaInput2: {
            id,
            ...input,
          },
        },
      });
      return data?.updateHealthScoreCriteria;
    } catch (err: any) {
      throw new Error(err.message || "Cập nhật tiêu chí thất bại!");
    }
  };

  return {
    loading,
    error,
    criteriaList: data?.healthScoreCriteriaByCoach || [],
    refetch,
    handleCreate,
    handleUpdate,
  };
};
