import type { Permission } from "@/models/Permission";

export default interface User {
  id: string;
  email: string;
  name?: string;
  enable: boolean;
  image?: string;
  updatedAt?: string;
  createdAt?: string;
  provider: string;
  roles: string[];
  status?: "ACTIVE" | "PENDING" | "REVIEW" | "DELETED" | "INACTIVE";
  permissions?: Permission[];
}
