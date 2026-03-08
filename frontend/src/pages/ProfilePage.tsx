import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import * as profileApi from "../api/profile";
import type { Profile, ProfileUpdate } from "../api/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [form, setForm] = useState<ProfileUpdate & { interestTags: string }>({
    nickname: "",
    age: null,
    gender: "",
    location: "",
    bio: "",
    avatar_url: "",
    interestTags: "",
  });

  useEffect(() => {
    let cancelled = false;
    profileApi.getMyProfile().then((data) => {
      if (cancelled) return;
      setProfile(data);
      setForm({
        nickname: data.nickname ?? "",
        age: data.age ?? null,
        gender: data.gender ?? "",
        location: data.location ?? "",
        bio: data.bio ?? "",
        avatar_url: data.avatar_url ?? "",
        interestTags: (data.interests ?? []).map((i) => i.name).join(", "),
      });
    }).catch(() => {
      if (!cancelled) setMessage({ type: "err", text: "Could not load profile" });
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const interest_names = form.interestTags
      .split(/[,，、\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const payload: ProfileUpdate = {
      nickname: form.nickname || undefined,
      age: form.age ?? undefined,
      gender: form.gender || undefined,
      location: form.location || undefined,
      bio: form.bio || undefined,
      avatar_url: form.avatar_url || undefined,
      interest_names: interest_names.length ? interest_names : undefined,
    };
    try {
      const updated = await profileApi.updateMyProfile(payload);
      setProfile(updated);
      setMessage({ type: "ok", text: "Saved" });
    } catch {
      setMessage({ type: "err", text: "Save failed. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">MeetNow</span>
          </Link>
          <nav className="flex gap-4">
            <Link to="/discover" className="text-sm font-medium text-slate-600 hover:text-pink-600">Discover</Link>
            <Link to="/matches" className="text-sm font-medium text-slate-600 hover:text-pink-600">Matches</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Edit your public profile and interest tags</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nickname</label>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Age</label>
                <input
                  type="number"
                  min={18}
                  max={120}
                  value={form.age ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      age: e.target.value === "" ? null : parseInt(e.target.value, 10) || null,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Gender</label>
                <input
                  type="text"
                  value={form.gender}
                  onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="e.g. Taipei"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700">Avatar URL</label>
              <input
                type="url"
                value={form.avatar_url}
                onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="https://..."
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700">Bio</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="A short intro about you..."
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700">Interest tags</label>
              <input
                type="text"
                value={form.interestTags}
                onChange={(e) => setForm((f) => ({ ...f, interestTags: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Comma-separated, e.g. Coffee, Movies, Travel"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-8"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      </main>
    </div>
  );
}
