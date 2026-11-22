import type { PermissionEntity, PermissionAction } from "@/models/Permission";

export interface RolePermission {
  entity: PermissionEntity;
  action: PermissionAction;
}

export type RoleStatus = "ACTIVE" | "PENDING" | "REVIEW" | "DELETED" | "INACTIVE";

export default interface Role {
  id: string;
  tenantId: string;
  identifier: string;
  name: string;
  isSystem: boolean;
  status: RoleStatus;
  permissions: RolePermission[];
  createdAt?: string;
  updatedAt?: string;
}
