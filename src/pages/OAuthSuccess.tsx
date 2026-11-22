import useAuth from "@/auth/store";
import { Spinner } from "@/components/ui/spinner";
import { refreshToken } from "@/services/AuthService";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { getApiErrorMessage } from "@/lib/apiError";

function OAuthSuccess() {
  const hasStarted = useRef(false);
  const changeLocalLoginData = useAuth((state) => state.changeLocalLoginData);
  const navigate = useNavigate();
  const tenantId = new URLSearchParams(window.location.search).get("tenantId") ?? undefined;

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    async function getAccessToken() {
      try {
        const responseLoginData = await refreshToken(tenantId);
        changeLocalLoginData(
          responseLoginData.accessToken,
          responseLoginData.user,
          true,
        );

        toast.success("Login success !");
        navigate("/dashboard");
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Unable to complete sign in."));
      }
    }

    void getAccessToken();
  }, [changeLocalLoginData, navigate, tenantId]);

  return (
    <div className="p-10 flex flex-col gap-3 justify-center items-center">
      <Spinner />
      <h1 className="text-2xl font-semibold">Please wait....</h1>
    </div>
  );
}

export default OAuthSuccess;
