export interface MemberProfile {
  id: string;
  user_id: string;
  sessions_per_day: number;
  recorded_at: string;
  price_per_pack: number;
  cigarettes_per_day?: number;
}

export interface CoachProfile {
  id: string;
  experience_years: number;
  user_id: string;
  bio?: string;
}

export interface User {
  id: string;
  user_name: string;
  name: string;
  avatar_url?: string;
  role: string;
  status: string;
  created_at: string;
  coach_profile?: CoachProfile | null;
  member_profile?: MemberProfile | null;
}

export interface GetAllUsersResponse {
  GetAllUsers: User[];
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