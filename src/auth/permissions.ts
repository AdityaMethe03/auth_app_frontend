import type User from "@/models/User";
import type { Permission } from "@/models/Permission";

export type { Permission } from "@/models/Permission";

export function hasPermission(
  user: Pick<User, "permissions"> | null | undefined,
  permission: Permission,
): boolean {
  return user?.permissions?.includes(permission) ?? false;
}
