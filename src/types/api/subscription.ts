export interface UserSubscription {
  id: string;
  user_id: string;
  package_id: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface GetUserSubscriptionResponse {
  getUserSubscription: UserSubscription | null;
}
