import { useEffect } from "react";
import useAuth from "@/auth/store";
import { Navigate, Outlet } from "react-router";
import { refreshToken } from "@/services/AuthService";
import toast from "react-hot-toast";

function Userlayout() {
  const checkLogin = useAuth((state) => state.checkLogin);
  const accessToken = useAuth((state) => state.accessToken);
  const user = useAuth((state) => state.user);
  const changeLocalLoginData = useAuth((state) => state.changeLocalLoginData);

  useEffect(() => {
    // Refresh once for persisted sessions created before permissions were returned.
    if (!accessToken || !user || user.permissions !== undefined) return;

    let cancelled = false;
    refreshToken()
      .then((response) => {
        if (!cancelled) {
          changeLocalLoginData(response.accessToken, response.user, true);
        }
      })
      .catch(() => {
        toast.error("Your session has ended. Please sign in again.");
        void useAuth.getState().logout();
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, user, changeLocalLoginData]);

  if (checkLogin())
    return (
      <div>
        <Outlet />
      </div>
    );
  else return <Navigate to={"/login"} />;
}

export default Userlayout;
