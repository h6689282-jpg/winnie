import { apiClient } from "./client";

export interface Interest {
  id: number;
  name: string;
}

export interface Profile {
  id: number;
  user: number;
  nickname: string;
  age: number | null;
  gender: string;
  location: string;
  bio: string;
  avatar_url: string;
  interests: Interest[];
  interest_names?: string[];
}

export interface ProfileUpdate {
  nickname?: string;
  age?: number | null;
  gender?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  interest_names?: string[];
}

export async function getMyProfile(): Promise<Profile> {
  const { data } = await apiClient.get<Profile>("/profile/me/");
  return data;
}

export async function updateMyProfile(payload: ProfileUpdate): Promise<Profile> {
  const { data } = await apiClient.put<Profile>("/profile/me/", payload);
  return data;
}

export async function getProfile(userId: number): Promise<Profile> {
  const { data } = await apiClient.get<Profile>(`/profile/${userId}/`);
  return data;
}
