import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(email, nickname.trim() || email.split("@")[0], password);
      navigate("/discover", { replace: true });
    } catch (err: unknown) {
      const ax = err && typeof err === "object" ? err as { code?: string; message?: string; response?: { data?: Record<string, unknown> } } : null;
      const data = ax?.response?.data ?? null;
      const detail = data && typeof data.detail === "string" ? data.detail : null;
      const isTimeout = ax?.code === "ECONNABORTED" || (typeof ax?.message === "string" && ax.message.toLowerCase().includes("timeout"));
      const isNetwork = ax?.message === "Network Error" || !ax?.response;
      const fallback = isTimeout || isNetwork
        ? "Cannot reach server. Make sure the backend is running (http://localhost:8000)"
        : "Registration failed. Please try again.";
      const fieldErrors: string[] = [];
      if (data && typeof data === "object" && !detail) {
        for (const [key, val] of Object.entries(data)) {
          if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
            fieldErrors.push(`${key}: ${val[0]}`);
          }
        }
      }
      setError(detail || (fieldErrors.length > 0 ? fieldErrors.join(" ") : fallback));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-violet-50">
      <header className="border-b border-white/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-900">MeetNow</span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-pink-600 hover:underline">
            Log in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">Sign up</h1>
          <p className="mt-1 text-sm text-slate-500">Create an account and start meeting new people</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-slate-700">
                Nickname
              </label>
              <input
                id="nickname"
                type="text"
                autoComplete="username"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Display name"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                placeholder="Enter password again"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing up…" : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-pink-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
