import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAccessToken, setTokens, clearTokens } from "../api/client";
import * as authApi from "../api/auth";
import type { UserMe } from "../api/auth";

interface AuthState {
  user: UserMe | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setState({ user: null, loading: false });
      return;
    }
    try {
      const user = await authApi.getMe();
      setState({ user, loading: false });
    } catch {
      clearTokens();
      setState({ user: null, loading: false });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const onLogout = () => setState({ user: null, loading: false });
    window.addEventListener("meetnow:logout", onLogout);
    return () => window.removeEventListener("meetnow:logout", onLogout);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { access, refresh } = await authApi.login({ email, password });
    setTokens(access, refresh);
    const user = await authApi.getMe();
    setState({ user, loading: false });
  }, []);

  const register = useCallback(async (email: string, username: string, password: string) => {
    await authApi.register({ email, username, password });
    const { access, refresh } = await authApi.login({ email, password });
    setTokens(access, refresh);
    const user = await authApi.getMe();
    setState({ user, loading: false });
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setState({ user: null, loading: false });
    window.dispatchEvent(new Event("meetnow:logout"));
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
