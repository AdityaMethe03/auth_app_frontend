import axios from "axios";

export interface ApiErrorDto {
  type: string;
  title: string;
  status: number;
  code: string;
  detail: string;
  instance: string;
  requestId: string;
  timestamp: string;
  errors: Record<string, string>;
}

type LegacyApiError = { message?: string };

export function getApiErrorCode(error: unknown): string | undefined {
  if (!axios.isAxiosError<ApiErrorDto>(error)) return undefined;
  return error.response?.data?.code;
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  return error.response?.status;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!axios.isAxiosError<ApiErrorDto | LegacyApiError>(error)) {
    return fallback;
  }

  const data = error.response?.data;
  if (data && "code" in data && data.code === "AUTHENTICATION_FAILED") {
    return "Authentication failed!";
  }
  if (data && "errors" in data && data.errors) {
    const fieldMessages = Object.entries(data.errors)
      .map(([field, message]) => `${field}: ${message}`)
      .join(" ");
    if (fieldMessages) return fieldMessages;
  }
  if (data && "detail" in data && data.detail) return data.detail;
  if (data && "message" in data && data.message) return data.message;

  if (!error.response) {
    return "Unable to reach the server. Check your connection and try again.";
  }

  return fallback;
}
