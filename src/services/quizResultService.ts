import client from "@/apollo/apolloClient";
import { GET_MY_TEMPLATE_MATCHING_RESULTS } from "@/graphql/queries/quizResult/getMyTemplateMatchingResults";
import { GET_TEMPLATE_MATCHING_RESULT_DETAILS } from "@/graphql/queries/quizResult/getTemplateMatchingResultDetails";

export const quizResultService = {
  getMyTemplateMatchingResults: async () => {
    const { data, errors } = await client.query({
      query: GET_MY_TEMPLATE_MATCHING_RESULTS,
      fetchPolicy: "network-only",
    });
    if (errors) {
      throw new Error(errors.map((e) => e.message).join(", "));
    }
    return data?.getMyTemplateMatchingResults || [];
  },

  getTemplateMatchingResultDetails: async (id: string) => {
    const { data, errors } = await client.query({
      query: GET_TEMPLATE_MATCHING_RESULT_DETAILS,
      variables: { getTemplateMatchingResultDetailsId: id },
      fetchPolicy: "network-only",
    });
    if (errors) {
      throw new Error(errors.map((e) => e.message).join(", "));
    }
    return data?.getTemplateMatchingResultDetails || null;
  },
};
