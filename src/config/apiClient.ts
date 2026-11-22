/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuth from "@/auth/store";
import { refreshToken } from "@/services/AuthService";
import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8787/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

//every request: before
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuth.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  const tenantId = useAuth.getState().tenantId;
  const configuredTenant = config.headers["X-G-APP-Tenant-Id"];
  if (!configuredTenant && tenantId) {
    config.headers["X-G-APP-Tenant-Id"] = tenantId;
  }

  return config;
});

let isRefreshing = false;
let sessionLogoutStarted = false;
let pending: any[] = [];

function endSession() {
  if (sessionLogoutStarted) return;
  sessionLogoutStarted = true;
  toast.error("Your session has ended. Please sign in again.");
  void useAuth.getState().logout();
}

function queueRequest(cb: any) {
  pending.push(cb);
}

function resolveQueue(newToken: string) {
  pending.forEach((cb) => cb(newToken));
  pending = [];
}

// response interceptors
apiClient.interceptors.response.use(
  (response) => {
    if (
      response.config.url?.includes("/auth/login") ||
      response.config.url?.includes("/auth/refresh")
    ) {
      sessionLogoutStarted = false;
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const is401 = status === 401;
    const original = error.config;
    const requestUrl = original?.url ?? "";
    const isAuthRequest = requestUrl.includes("/auth/");
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(
      original?.method?.toUpperCase() ?? "",
    );

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    if (status === 403) {
      return Promise.reject(error);
    }

    if (status === 404 && isMutation) {
      endSession();
      return Promise.reject(error);
    }

    if (!is401 || !original) {
      return Promise.reject(error);
    }

    if (original._retry) {
      endSession();
      return Promise.reject(error);
    }

    original._retry = true;
    //we will try to refresh the token:
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queueRequest((newToken: string) => {
          if (!newToken) return reject();
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(original));
        });
      });
    }

    //start refresh
    isRefreshing = true;

    try {
      const loginResponse = await refreshToken();
      const newToken = loginResponse.accessToken;
      if (!newToken) throw new Error("no access token received");
      useAuth
        .getState()
        .changeLocalLoginData(
          loginResponse.accessToken,
          loginResponse.user,
          true,
        );
      //
      resolveQueue(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (error) {
      resolveQueue("null");
      endSession();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
