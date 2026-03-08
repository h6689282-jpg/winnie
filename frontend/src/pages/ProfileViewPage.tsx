import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import { getProfile } from "../api/profile";
import type { Profile } from "../api/profile";

export default function ProfileViewPage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = userId ? parseInt(userId, 10) : NaN;
    if (Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    getProfile(id)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12 text-center">
        <p className="text-slate-600">User not found</p>
        <Link to="/matches" className="mt-4 inline-block text-pink-600 hover:underline">Back to matches</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">MeetNow</span>
          </Link>
          <Link to="/matches" className="text-sm font-medium text-pink-600 hover:underline">Back to matches</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="aspect-[3/2] bg-gradient-to-br from-rose-200 via-pink-100 to-violet-200">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.nickname || ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl text-white/60">
                {profile.nickname?.charAt(0) || "?"}
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.nickname || "No nickname"}
                {profile.age != null && `, ${profile.age}`}
              </h1>
              {profile.location && (
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="h-4 w-4" /> {profile.location}
                </span>
              )}
            </div>
            {profile.gender && <p className="mt-1 text-sm text-slate-500">{profile.gender}</p>}
            {profile.bio && <p className="mt-4 text-slate-600">{profile.bio}</p>}
            {profile.interests?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <span
                    key={i.id}
                    className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600"
                  >
                    {i.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
