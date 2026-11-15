export type PermissionEntity = "USER" | "ROLE";
export type PermissionAction = "READ" | "WRITE" | "UPDATE" | "DELETE";
export type Permission = `${PermissionEntity}:${PermissionAction}`;
