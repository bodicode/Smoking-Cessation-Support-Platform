import { jwtDecode } from "jwt-decode";
import client from "@/apollo/apolloClient";
import { GET_USER_PROFILE, GET_CURRENT_USER } from "@/graphql/queries/user/getUserProfile";
import { UserProfile, GetUserProfileResponse } from "@/types/api/user";

// Get user ID from JWT token using existing pattern
export function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    const decoded: any = jwtDecode(token);
    return decoded.sub || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
}

// Get user profile by ID
export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const { data, errors } = await client.query<GetUserProfileResponse>({
      query: GET_USER_PROFILE,
      variables: { id: userId },
      fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return data.findOneUser;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Get current user profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error("User not authenticated");
    }

    const { data, errors } = await client.query({
      query: GET_CURRENT_USER,
      context: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return data.findOneUser;
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
}
