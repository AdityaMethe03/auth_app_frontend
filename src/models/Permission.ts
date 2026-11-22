export type PermissionEntity = "USER" | "ROLE" | "TENANT";
export type PermissionAction = "READ" | "WRITE" | "UPDATE" | "DELETE";
export type Permission = `${PermissionEntity}:${PermissionAction}`;
