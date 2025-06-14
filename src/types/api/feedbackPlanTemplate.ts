export interface CreateFeedbackInput {
  rating: number;
  content: string;
  template_id: string;
  is_anonymous?: boolean;
}

export interface FeedbackParams {
  limit?: number;
  page?: number;
  search?: string;
  orderBy?: string;
  sortOrder?: string;
}

export interface FeedbackFilters {
  templateId?: string;
  userId?: string;
}

export interface GetFeedbacksInput {
  params?: FeedbackParams;
  filters?: FeedbackFilters;
}

export interface UseFeedbacksProps {
  templateId?: string;
  userId?: string;
  limit?: number;
  page?: number;
  search?: string;
  orderBy?: string;
  sortOrder?: string;
  reload?: number;
}