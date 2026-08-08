const ACCESS = "access_token";
const REFRESH = "refresh_token";
const USER = "user";

export const storage = {
  save(data: {
    access: string;
    refresh: string;
    user: unknown;
  }) {
    localStorage.setItem(ACCESS, data.access);
    localStorage.setItem(REFRESH, data.refresh);
    localStorage.setItem(USER, JSON.stringify(data.user));
  },

  getAccess() {
    return localStorage.getItem(ACCESS);
  },

  getRefresh() {
    return localStorage.getItem(REFRESH);
  },

  getUser() {
    const user = localStorage.getItem(USER);
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem(USER);
      return null;
    }
  },

  saveUser(user: unknown) {
    localStorage.setItem(USER, JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER);
  },

  clear() {
    this.clearAuth();
  },
};