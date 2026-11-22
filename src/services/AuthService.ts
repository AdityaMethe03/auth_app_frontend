import type RegisterData from "@/models/RegisterData";
import apiClient from "@/config/apiClient";
import type LoginData from "@/models/LoginData";
import type LoginResponseData from "@/models/LoginResponseData";
import type User from "@/models/User";
import type Role from "@/models/Role";
//register function
export const registerUser = async (signupData: RegisterData) => {
  const { tenantId, ...input } = signupData;
  const response = await apiClient.post(`/auth/register`, input, {
    headers: { "X-G-APP-Tenant-Id": tenantId },
  });
  return response.data;
};

//login
export const loginUser = async (loginData: LoginData) => {
  const response = await apiClient.post<LoginResponseData>(
    "/auth/login",
    { email: loginData.email, password: loginData.password },
    { headers: { "X-G-APP-Tenant-Id": loginData.tenantId } },
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

export const getAllUsers = async (tenantId?: string) => {
  const response = await apiClient.get<User[]>("/users/lookup/search/all", {
    headers: tenantId ? { "X-G-APP-Tenant-Id": tenantId } : undefined,
  });
  return response.data;
};

export const createManagedUser = async (input: {
  email: string;
  name: string;
  password: string;
  roles: string[];
}, tenantId?: string) => {
  const response = await apiClient.post<User>("/users/register", {
    ...input,
    enable: true,
    provider: "LOCAL",
    status: "ACTIVE",
  }, {
    headers: tenantId ? { "X-G-APP-Tenant-Id": tenantId } : undefined,
  });
  return response.data;
};

export const updateManagedUser = async (
  userId: string,
  input: Pick<User, "name" | "enable" | "status" | "roles">,
  tenantId?: string,
) => {
  const response = await apiClient.put<User>(`/users/update/all/${userId}`, input, {
    headers: tenantId ? { "X-G-APP-Tenant-Id": tenantId } : undefined,
  });
  return response.data;
};

export const deleteManagedUser = async (userId: string, tenantId?: string) => {
  await apiClient.delete(`/users/delete/${userId}`, {
    headers: tenantId ? { "X-G-APP-Tenant-Id": tenantId } : undefined,
  });
};

export const getAllRoles = async (tenantId?: string) => {
  const response = await apiClient.get<Role[]>("/role/lookup/search/all", {
    headers: tenantId ? { "X-G-APP-Tenant-Id": tenantId } : undefined,
  });
  return response.data;
};

type RoleInput = Pick<Role, "identifier" | "name" | "status" | "permissions">;

export const createRole = async (role: RoleInput, tenantId?: string) => {
  const response = await apiClient.post<Role>("/role/register", role, {
    headers: tenantId ? { "X-G-APP-Tenant-Id": tenantId } : undefined,
  });
  return response.data;
};

export const updateRole = async (
  roleId: string,
  role: RoleInput,
  tenantId?: string,
) => {
  const response = await apiClient.put<Role>(`/role/update/${roleId}`, role, {
    headers: tenantId ? { "X-G-APP-Tenant-Id": tenantId } : undefined,
  });
  return response.data;
};

export const deleteRole = async (roleId: string, tenantId?: string) => {
  await apiClient.delete(`/role/delete/${roleId}`, {
    headers: tenantId ? { "X-G-APP-Tenant-Id": tenantId } : undefined,
  });
};

export interface Tenant {
  id: string;
  tenantCode: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  contactPerson: string;
  contactEmail: string;
  contactNumber: string;
}

export const getAllTenants = async () => {
  const response = await apiClient.get<Tenant[]>("/tenants/lookup/search/all");
  return response.data;
};

export const createTenant = async (input: {
  tenantCode: string;
  name: string;
  contactPerson: string;
  contactEmail: string;
  contactNumber: string;
}) => {
  const response = await apiClient.post<Tenant>("/tenants/register", input);
  return response.data;
};

export const updateTenant = async (
  tenantCode: string,
  input: Pick<Tenant, "name" | "status">,
) => {
  const response = await apiClient.put<Tenant>(`/tenants/update/${tenantCode}`, input);
  return response.data;
};

//refresh token

export const refreshToken = async (tenantId?: string) => {
  const response = await apiClient.post<LoginResponseData>(`/auth/refresh`, null, {
    headers: tenantId ? { "X-G-APP-Tenant-Id": tenantId } : undefined,
  });
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
