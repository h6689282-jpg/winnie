import { apiClient } from "./client";

export interface LikeResponse {
  match: boolean;
}

export async function sendLike(toUserId: number): Promise<LikeResponse> {
  const { data } = await apiClient.post<LikeResponse>("/likes/", {
    to_user_id: toUserId,
    action: "like",
  });
  return data;
}
