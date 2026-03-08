import { apiClient } from "./client";

export interface DiscoverUser {
  id: number;
  email: string;
  username: string;
  nickname: string;
  age: number | null;
  gender: string;
  location: string;
  avatar_url: string;
}

export async function getDiscover(): Promise<DiscoverUser[]> {
  const { data } = await apiClient.get<DiscoverUser[]>("/discover/");
  return data;
}
