export interface CoachProfile {
  approach_description: string;
  average_rating: number;
  certifications: string[];
  education: string | null;
  created_at: string;
  experience_years: number;
  id: string;
  professional_bio: string | null;
  specializations: string[];
  success_rate: number;
  total_clients: number;
  total_sessions: number;
  updated_at: string;
  user_id: string;
}

export interface MemberProfile {
  allergies: string[];
  brand_preference: string | null;
  cigarettes_per_day: number;
  daily_routine: string | null;
  health_conditions: string[];
  id: string;
  medications: string[];
  nicotine_level: string | null;
  preferred_support: string[];
  previous_attempts: string | null;
  price_per_pack: number;
  quit_motivation: string | null;
  recorded_at: string;
  sessions_per_day: number;
  smoking_years: string | null;
  social_support: string | null;
  stress_level: string | null;
  trigger_factors: string[];
  user_id: string;
}

export interface UserProfile {
  avatar_url: string | null;
  coach_profile: CoachProfile[];
  created_at: string;
  id: string;
  member_profile: MemberProfile[];
} 