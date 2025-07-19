import client from "@/apollo/apolloClient";
import { GET_TEMPLATE_USAGE_STATS } from "@/graphql/queries/templates/getTemplateUsageStats";
import { TemplateUsageStats, GetTemplateUsageStatsInput } from "@/types/api/templateUsageStats";

export async function getTemplateUsageStats(input: GetTemplateUsageStatsInput): Promise<TemplateUsageStats> {
  const { data, errors } = await client.query({
    query: GET_TEMPLATE_USAGE_STATS,
    variables: {
      templateId: input.templateId,
      params: input.params || {
        page: 1,
        limit: 10,
        orderBy: "created_at",
        sortOrder: "desc"
      },
      filters: input.filters || {
        status: "",
        search: ""
      }
    },
    fetchPolicy: "network-only",
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message || "Không thể lấy thống kê sử dụng template");
  }

  return data.templateUsageStats as TemplateUsageStats;
} 