import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";
import { loginUser, logoutUser } from "@/services/AuthService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const LOCAL_KEY = "app_state";
//type AuthStatus = "idle" | "authenticating" | "authenticated" | "anonymous";

//global authstate:

type AuthState = {
  accessToken: string | null;
  tenantId: string | null;
  user: User | null;
  authStatus: boolean;
  authLoading: boolean;
  login: (loginData: LoginData) => Promise<LoginResponseData>;
  logout: (silent?: boolean) => void;
  checkLogin: () => boolean;

  changeLocalLoginData: (
    accessToken: string,
    user: User,
    authStatus: boolean,
  ) => void;
};

//main logic for global state
const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      tenantId: null,
      user: null,
      authStatus: false,
      authLoading: false,

      changeLocalLoginData: (accessToken, user, authStatus) => {
        set({
          accessToken,
          tenantId: user.tenantId,
          user,
          authStatus,
        });
      },
      login: async (loginData) => {
        console.log("started login...");
        set({ authLoading: true });
        try {
          const loginResponseData = await loginUser(loginData);
          console.log(loginResponseData);
          set({
            accessToken: loginResponseData.accessToken,
            tenantId: loginResponseData.user.tenantId,
            user: loginResponseData.user,
            authStatus: true,
          });
          return loginResponseData;
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          set({
            authLoading: false,
          });
        }
      },
      logout: async () => {
        try {
          set({
            authLoading: true,
          });
          await logoutUser();
        } catch (error) {
          // Clear the local session even when the server cannot revoke the cookie.
          console.error("Server logout failed; clearing local auth state", error);
        } finally {
          set({
            accessToken: null,
            tenantId: null,
            user: null,
            authLoading: false,
            authStatus: false,
          });
        }
      },
      checkLogin: () => Boolean(get().accessToken && get().authStatus),
    }),

    { name: LOCAL_KEY },
  ),
);

export default useAuth;
