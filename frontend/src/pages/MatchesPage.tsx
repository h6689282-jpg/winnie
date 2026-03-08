import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import { getMatches } from "../api/matches";
import type { MatchUser } from "../api/matches";

export default function MatchesPage() {
  const [users, setUsers] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

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
            <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-pink-600">Profile</Link>
            <Link to="/discover" className="text-sm font-medium text-slate-600 hover:text-pink-600">Discover</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Matches</h1>
        <p className="mt-1 text-sm text-slate-500">People you've mutually liked appear here</p>

        {users.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600">No matches yet</p>
            <p className="mt-2 text-sm text-slate-500">Like people on Discover—when they like you back, you'll match</p>
            <Link
              to="/discover"
              className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Discover
            </Link>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {users.map((user) => (
              <li key={user.id}>
                <Link
                  to={`/profile/${user.id}`}
                  className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-rose-200 via-pink-100 to-violet-200">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.nickname || user.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl text-white/60">
                        {user.nickname?.charAt(0) || user.username?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {user.nickname || user.username || "No nickname"}
                      </h2>
                      {user.age != null && (
                        <span className="text-sm text-slate-500">{user.age} y/o</span>
                      )}
                    </div>
                    {user.location && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5" /> {user.location}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
