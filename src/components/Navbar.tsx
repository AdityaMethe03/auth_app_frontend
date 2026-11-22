import { Button } from "./ui/button";
import { NavLink, useNavigate } from "react-router";
import useAuth from "@/auth/store";
import { hasPermission } from "@/auth/permissions";
import { House } from "lucide-react";

function Navbar() {
  const checkLogin = useAuth((state) => state.checkLogin);
  const user = useAuth((state) => state.user);
  const canManageUsers = hasPermission(user, "USER:READ");
  const canViewRoles = hasPermission(user, "ROLE:READ");
  const canViewTenants = hasPermission(user, "TENANT:READ");
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  return (
    <nav className="py-5  dark:border-b border-gray-700 md:py-0 flex md:flex-row gap-4 md:gap-0 flex-col md:h-14 justify-around items-center    ">
      {/* brand */}
      <div className="font-semibold items-center flex gap-2">
        <span className="inline-block text-center h-6 w-6 rounded-md bg-gradient-to-r from-primary to-primary/40">
          {"A"}
        </span>
        {checkLogin() ? (
          <NavLink to={"/dashboard"} className="text-base tracking-tight">
            Auth App
          </NavLink>
        ) : (
          <span className="text-base tracking-tight">Auth App</span>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {checkLogin() ? (
          <>
            <NavLink to={"/dashboard/profile"}>{user?.name}</NavLink>

            {canManageUsers && <NavLink to="/dashboard/admin/users">Users</NavLink>}
            {canViewRoles && <NavLink to="/dashboard/admin/roles">Roles</NavLink>}
            {canViewTenants && <NavLink to="/dashboard/admin/tenants">Tenants</NavLink>}

            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
              size={"sm"}
              className="cursor-pointer"
              variant={"outline"}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <NavLink
              to="/"
              aria-label="Home"
              title="Home"
              className={({ isActive }) =>
                `inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground ${
                  isActive ? "bg-accent text-foreground" : "text-muted-foreground"
                }`
              }
            >
              <House aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-foreground ${
                  isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-foreground ${
                  isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                }`
              }
            >
              Services
            </NavLink>
            <NavLink to="/login">
              {({ isActive }) => (
                <Button
                  size="sm"
                  className="cursor-pointer"
                  variant="outline"
                  style={isActive ? { backgroundColor: "#fff", borderColor: "#fff", color: "#000" } : undefined}
                >
                  Login
                </Button>
              )}
            </NavLink>
            <NavLink to="/signup">
              {({ isActive }) => (
                <Button
                  size="sm"
                  className="cursor-pointer"
                  variant="outline"
                  style={isActive ? { backgroundColor: "#fff", borderColor: "#fff", color: "#000" } : undefined}
                >
                  Signup
                </Button>
              )}
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
