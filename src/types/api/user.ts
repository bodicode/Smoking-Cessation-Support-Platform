export interface MemberProfile {
  cigarettes_per_day: number;
  sessions_per_day: number;
  price_per_pack: number;
  recorded_at: string;
}

export interface CoachProfile {
  experience_years: number;
  bio: string;
}

export interface UserProfile {
  id: string;
  user_name: string;
  name: string;
  avatar_url?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  member_profile?: MemberProfile;
  coach_profile?: CoachProfile;
}

export interface GetUserProfileResponse {
  findOneUser: UserProfile;
}
