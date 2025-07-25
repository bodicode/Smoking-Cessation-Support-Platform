import { jwtDecode } from "jwt-decode";
import client from "@/apollo/apolloClient";
import { UserProfile, GetUserProfileResponse, User } from "@/types/api/user";
import { GET_ALL_USERS } from "@/graphql/queries/user/getAllUsers";
import { REMOVE_USER_BY_ADMIN } from "@/graphql/mutations/user/removeUserMutation";
import { UPDATE_USER_BY_ADMIN } from "@/graphql/mutations/user/updateUserByAdmin";
import { CREATE_USER_BY_ADMIN } from "@/graphql/mutations/user/createUserByAdmin";
import { GET_ALL_COACHES } from "@/graphql/queries/user/getAllCoaches";
import { FIND_ONE_USER } from "@/graphql/queries/user/getUserProfile";
import { UPDATE_USER_PROFILE } from "@/graphql/mutations/user/updateUserProfile";
import { GET_STREAK_LEADERBOARD } from "@/graphql/queries/user/getStreakLeaderboard";

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

export async function getUserProfile(userId: string): Promise<UserProfile> {
  try {
    const { data, errors } = await client.query<GetUserProfileResponse>({
      query: FIND_ONE_USER,
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

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const userId = getUserIdFromToken();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  return getUserProfile(userId);
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, errors } = await client.query<{ GetAllUsers: User[] }>({
      query: GET_ALL_USERS,
      fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return data.GetAllUsers;
  } catch (error) {
    throw error;
  }
}

export async function getAllCoaches() {
  try {
    const { data, errors } = await client.query({
      query: GET_ALL_COACHES,
      fetchPolicy: "network-only",
    });
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return data.findAllCoaches;
  } catch (error) {
    throw error;
  }
}

export async function removeUserByAdmin(id: string): Promise<User> {
  try {
    const { data, errors } = await client.mutate<{ removeUserByAdmin: User }>({
      mutation: REMOVE_USER_BY_ADMIN,
      variables: { removeUserByAdminId: id },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return data!.removeUserByAdmin;
  } catch (error) {
    throw error;
  }
}

export async function updateUserByAdmin(updateUserInput: any): Promise<User> {
  try {
    const { data, errors } = await client.mutate<{ updateUserByAdmin: User }>({
      mutation: UPDATE_USER_BY_ADMIN,
      variables: { updateUserInput },
    });
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return data!.updateUserByAdmin;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function createUserByAdmin(createUserInput: any) {
  try {
    const { data, errors } = await client.mutate({
      mutation: CREATE_USER_BY_ADMIN,
      variables: { createUserInput },
    });
    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }
    return data.createUserByAdmin.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUserProfileNew() {
  const { data, errors } = await client.query({
    query: FIND_ONE_USER,
    fetchPolicy: "no-cache"
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Lấy user profile thất bại");
  return data.findOneUser;
}

export async function getStreakLeaderboard(limit = 10, offset = 0) {
  const { data, errors } = await client.query({
    query: GET_STREAK_LEADERBOARD,
    variables: { limit, offset },
    fetchPolicy: "no-cache"
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Không thể lấy leaderboard");
  return data.streakLeaderboard;
}

export async function updateUserProfile(input: any) {
  const { data, errors } = await client.mutate({
    mutation: UPDATE_USER_PROFILE,
    variables: { updateUserInput: input },
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Không thể cập nhật hồ sơ");
  return data?.updateUserProfile;
}

export async function getCurrentCoachProfile() {
  const { data, errors } = await client.query({
    query: FIND_ONE_USER,
    fetchPolicy: "no-cache"
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Lấy coach profile thất bại");
  return data.findOneUser;
}