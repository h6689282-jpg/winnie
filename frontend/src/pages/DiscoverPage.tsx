import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, X } from "lucide-react";
import { getDiscover } from "../api/discover";
import { sendLike } from "../api/likes";
import type { DiscoverUser } from "../api/discover";

export default function DiscoverPage() {
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [matchMessage, setMatchMessage] = useState<string | null>(null);

  useEffect(() => {
    getDiscover()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const current = users[index];

  async function handleLike() {
    if (!current || actionLoading) return;
    setActionLoading(true);
    setMatchMessage(null);
    try {
      const { match } = await sendLike(current.id);
      if (match) setMatchMessage("It's a match! You both liked each other.");
      setIndex((i) => i + 1);
    } catch {
      setIndex((i) => i + 1);
    } finally {
      setActionLoading(false);
    }
  }

  function handlePass() {
    if (!current || actionLoading) return;
    setIndex((i) => i + 1);
    setMatchMessage(null);
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
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">MeetNow</span>
          </Link>
          <nav className="flex gap-4">
            <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-pink-600">Profile</Link>
            <Link to="/matches" className="text-sm font-medium text-slate-600 hover:text-pink-600">Matches</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-8">
        <h1 className="text-xl font-bold text-slate-900">Discover</h1>
        <p className="mt-1 text-sm text-slate-500">Tap Like for interest, Pass to skip</p>

        {matchMessage && (
          <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {matchMessage}
          </div>
        )}

        {!current ? (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600">No more people for now</p>
            <p className="mt-2 text-sm text-slate-500">Check back later or view your matches</p>
            <Link
              to="/matches"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              View matches
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            <div className="aspect-[3/4] bg-gradient-to-br from-rose-200 via-pink-100 to-violet-200">
              {current.avatar_url ? (
                <img
                  src={current.avatar_url}
                  alt={current.nickname || current.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl text-white/60">
                  {current.nickname?.charAt(0) || current.username?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {current.nickname || current.username || "No nickname"}, {current.age ?? "—"}
                </h2>
                {current.location && (
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" /> {current.location}
                  </span>
                )}
              </div>
              {current.gender && (
                <p className="mt-1 text-sm text-slate-500">{current.gender}</p>
              )}
            </div>
            <div className="flex gap-3 border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={handlePass}
                disabled={actionLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <X className="h-6 w-6" /> Pass
              </button>
              <button
                type="button"
                onClick={handleLike}
                disabled={actionLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <Heart className="h-6 w-6" /> Like
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
