import client from "@/apollo/apolloClient";
import { GET_USER_BY_ID } from "@/graphql/queries/user/getUserById";
import { UserProfile } from "@/types/api/userProfile";

export async function getUserById(userId: string): Promise<UserProfile> {
  const { data, errors } = await client.query({
    query: GET_USER_BY_ID,
    variables: { userId },
    fetchPolicy: "network-only",
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message || "Không thể lấy thông tin người dùng");
  }

  return data.findUserById as UserProfile;
} 