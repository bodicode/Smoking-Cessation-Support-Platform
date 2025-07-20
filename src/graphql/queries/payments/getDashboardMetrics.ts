import { gql } from "@apollo/client";

export const GET_DASHBOARD_METRICS = gql`
  query GetDashboardMetrics {
    getDashboardMetrics {
      revenueByMonth {
        month
        revenue
      }
      stats {
        averageTemplateRating
        totalCessationTemplates
        totalCoaches
        totalRevenue
        totalUsers
      }
    }
  }
`;

export interface RevenueByMonth {
  month: string;
  revenue: number;
}

export interface DashboardStats {
  averageTemplateRating: number;
  totalCessationTemplates: number;
  totalCoaches: number;
  totalRevenue: number;
  totalUsers: number;
}

export interface DashboardMetrics {
  revenueByMonth: RevenueByMonth[];
  stats: DashboardStats;
}

export interface GetDashboardMetricsResponse {
  getDashboardMetrics: DashboardMetrics;
} 