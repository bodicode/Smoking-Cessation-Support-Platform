export interface TemplateUsageStats {
  template_id: string;
  template_name: string;
  total_users: number;
  stats_by_status: StatusStats[];
  users: {
    data: TemplateUser[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  };
}

export interface StatusStats {
  status: string;
  count: number;
}

export interface TemplateUser {
  id: string;
  user_id: string;
  status: string;
  start_date: string;
  target_date: string;
  completion_percentage: number;
  days_since_start: number;
  days_to_target: number;
  is_overdue: boolean;
  user: {
    id: string;
    name: string;
    user_name: string;
    avatar_url: string | null;
  };
}

export interface TemplateUsageFilters {
  status?: string;
  search?: string;
}

export interface TemplateUsageParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  sortOrder?: string;
}

export interface GetTemplateUsageStatsInput {
  templateId: string;
  params?: TemplateUsageParams;
  filters?: TemplateUsageFilters;
} 