import type RegisterData from "@/models/RegisterData";
import apiClient from "@/config/apiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";
//register function
export const registerUser = async (signupData: RegisterData) => {
  // api call to server to save data
  const response = await apiClient.post(`/auth/register`, signupData);
  return response.data;
};

//login
export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post<LoginResponseData>(
    "/auth/login",
    loginData,
  );
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post(`/auth/logout`);
  return response.data;
};

//get current login user
export const getCurrentUser = async (emailId: string | undefined) => {
  const response = await apiClient.get<User>(
    `/users/lookup/search/email/${emailId}`,
  );
  return response.data;
};

//refresh token

export const refreshToken = async () => {
  const response = await apiClient.post<LoginResponseData>(`/auth/refresh`);
  return response.data;
};

//apis

export const updateUserProfile = async (
  userId: string,
  name: string,
  image: string,
) => {
  const response = await apiClient.put<User>(
    `/users/update/profile/${userId}`,
    { name, image },
  );
  return response.data;
};

export const updateUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const response = await apiClient.put<User>(
    `/users/update/password/${userId}`,
    { oldPassword, newPassword },
  );

  return response.data;
}

export const deleteUserAccount = async (userId: string) => {
  const response = await apiClient.delete<User>(`/users/delete/${userId}`);

  return response.data;
}
