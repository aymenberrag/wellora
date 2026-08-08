import type { User } from "../types/user";

export function hasPermission(user: User | null | undefined, permission: string) {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;
  return user.permissions?.includes(permission) ?? false;
}

export function canAccess(user: User | null | undefined, resource: string, action: string) {
  return hasPermission(user, `${resource}.${action}`);
}

export function canManageUsers(user: User | null | undefined) {
  return canAccess(user, "users", "add") || canAccess(user, "users", "change") || canAccess(user, "users", "delete");
}
