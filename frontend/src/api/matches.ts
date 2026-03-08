import { apiClient } from "./client";

export interface MatchUser {
  id: number;
  email: string;
  username: string;
  nickname: string;
  age: number | null;
  gender: string;
  location: string;
  avatar_url: string;
}

export async function getMatches(): Promise<MatchUser[]> {
  const { data } = await apiClient.get<MatchUser[]>("/matches/");
  return data;
}
