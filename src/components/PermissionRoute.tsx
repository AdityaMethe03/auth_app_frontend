import { hasPermission, type Permission } from "@/auth/permissions";
import useAuth from "@/auth/store";
import { Navigate, Outlet } from "react-router";

export default function PermissionRoute({ permission }: { permission: Permission }) {
  const user = useAuth((state) => state.user);
  if (user && user.permissions === undefined) {
    return <div className="p-8 text-center text-muted-foreground">Loading access…</div>;
  }
  return hasPermission(user, permission) ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
