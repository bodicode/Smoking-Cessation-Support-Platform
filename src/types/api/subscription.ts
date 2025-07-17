// Subscription-related TypeScript types

export interface UserSubscription {
  id: string;
  user_id: string;
  package_id: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface GetUserSubscriptionResponse {
  getUserSubscription: UserSubscription;
}

export interface CreateSubscriptionInput {
  user_id: string;
  package_id: string;
  start_date: string;
  end_date: string;
}

export interface UpdateSubscriptionInput {
  id: string;
  status?: string;
  end_date?: string;
}
