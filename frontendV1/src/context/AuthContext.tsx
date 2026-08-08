import { createContext, useContext, useMemo, useState } from "react";
import { logout as logoutRequest } from "../services/auth";
import { storage } from "../services/storage";
import { queryClient } from "../services/queryClient";
import type { User } from "../types/user";

type AuthContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => storage.getUser());

  const setUser = (nextUser: User | null) => {
    setUserState(nextUser);
    if (nextUser) storage.saveUser(nextUser);
  };

  const logout = async () => {
    const refresh = storage.getRefresh();
    try {
      if (refresh) await logoutRequest(refresh);
    } catch (error) {
      console.warn("Logout request failed; clearing local authentication.", error);
    } finally {
      storage.clearAuth();
      queryClient.clear();
      setUserState(null);
      window.location.replace("/");
    }
  };

  const value = useMemo(() => ({ user, setUser, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
