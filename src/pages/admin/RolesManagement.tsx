import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasPermission } from "@/auth/permissions";
import useAuth from "@/auth/store";
import type Role from "@/models/Role";
import type { RoleStatus } from "@/models/Role";
import type { Permission, PermissionAction, PermissionEntity } from "@/models/Permission";
import { createRole, deleteRole, getAllRoles, updateRole } from "@/services/AuthService";
import toast from "react-hot-toast";

const ENTITIES: PermissionEntity[] = ["USER", "ROLE"];
const ACTIONS: PermissionAction[] = ["READ", "WRITE", "UPDATE", "DELETE"];
const STATUSES: RoleStatus[] = ["ACTIVE", "PENDING", "REVIEW", "INACTIVE", "DELETED"];

function RolesManagement() {
  const user = useAuth((state) => state.user);
  const canCreate = hasPermission(user, "ROLE:WRITE");
  const canUpdate = hasPermission(user, "ROLE:UPDATE");
  const canDelete = hasPermission(user, "ROLE:DELETE");
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleIdentifier, setRoleIdentifier] = useState("");
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState<RoleStatus>("ACTIVE");
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const visibleRoles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? roles.filter((role) => `${role.name} ${role.identifier}`.toLowerCase().includes(query)) : roles;
  }, [roles, search]);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    try {
      setRoles(await getAllRoles());
    } catch (error) {
      console.error("Unable to load roles", error);
      toast.error("Unable to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  function beginCreate() {
    setEditingRole(null);
    setRoleIdentifier("");
    setRoleName("");
    setStatus("ACTIVE");
    setPermissions([]);
    setDialogOpen(true);
  }

  function beginEdit(role: Role) {
    setEditingRole(role);
    setRoleIdentifier(role.identifier);
    setRoleName(role.name);
    setStatus(role.status);
    setPermissions((role.permissions ?? []).map(({ entity, action }) => `${entity}:${action}` as Permission));
    setDialogOpen(true);
  }

  function togglePermission(permission: Permission, checked: boolean) {
    setPermissions((current) => checked
      ? [...new Set([...current, permission])]
      : current.filter((item) => item !== permission));
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const payload = {
      identifier: roleIdentifier.trim(),
      name: roleName.trim(),
      status,
      permissions: permissions.map((value) => {
        const [entity, action] = value.split(":");
        return { entity: entity as PermissionEntity, action: action as PermissionAction };
      }),
    } as Omit<Role, "id" | "createdAt" | "updatedAt">;

    try {
      if (editingRole) {
        const updated = await updateRole(editingRole.id, payload);
        setRoles((current) => current.map((role) => role.id === updated.id ? updated : role));
        toast.success("Role updated.");
      } else {
        const created = await createRole(payload);
        setRoles((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
        toast.success("Role created.");
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Unable to save role", error);
      toast.error("Unable to save role.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(role: Role) {
    if (!window.confirm(`Delete the ${role.name} role? Users with this role will lose it.`)) return;
    try {
      await deleteRole(role.id);
      setRoles((current) => current.filter((item) => item.id !== role.id));
      toast.success("Role deleted.");
    } catch (error) {
      console.error("Unable to delete role", error);
      toast.error("Unable to delete role.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Administration</p>
          <h1 className="text-3xl font-bold">Roles & permissions</h1>
          <p className="mt-1 text-muted-foreground">Define which actions each role can perform.</p>
        </div>
        {canCreate && <Button onClick={beginCreate}>Create role</Button>}
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Roles</CardTitle>
          <Input className="max-w-xs" placeholder="Search roles" value={search} onChange={(event) => setSearch(event.target.value)} />
        </CardHeader>
        <CardContent>
          {loading ? <p className="py-8 text-center text-muted-foreground">Loading roles…</p> : (
            <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr><th className="p-3">Role</th><th className="p-3">Identifier</th><th className="p-3">Type</th><th className="p-3">Status</th><th className="p-3">Permissions</th><th className="p-3 text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {visibleRoles.map((role) => <tr className="border-b last:border-0" key={role.id}>
                    <td className="p-3 font-medium">{role.name}</td>
                    <td className="p-3 font-mono text-xs">{role.identifier}</td>
                    <td className="p-3">{role.isSystem ? "System" : "Custom"}</td>
                    <td className="p-3">{role.status}</td>
                    <td className="p-3"><div className="flex max-w-lg flex-wrap gap-1">{role.permissions?.map(({ entity, action }) => <span className="rounded bg-muted px-2 py-1 text-xs" key={`${entity}:${action}`}>{entity}:{action}</span>)}</div></td>
                    <td className="p-3"><div className="flex justify-end gap-2">
                      {canUpdate && role.identifier !== "SUDO_ADMIN" && <Button size="sm" variant="outline" onClick={() => beginEdit(role)}>Edit</Button>}
                      {canDelete && !role.isSystem && <Button size="sm" variant="destructive" onClick={() => void handleDelete(role)}>Delete</Button>}
                    </div></td>
                  </tr>)}
                  {!visibleRoles.length && <tr><td className="p-8 text-center text-muted-foreground" colSpan={6}>No roles found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingRole ? `Edit ${editingRole.name}` : "Create role"}</DialogTitle></DialogHeader>
          <form className="space-y-5" onSubmit={handleSave}>
            <div><Label htmlFor="role-identifier">Permanent identifier</Label><Input id="role-identifier" value={roleIdentifier} onChange={(event) => setRoleIdentifier(event.target.value)} placeholder="support_agent" pattern="[A-Za-z][A-Za-z0-9_-]*" required disabled={Boolean(editingRole)} /><p className="text-xs text-muted-foreground">This identifier is permanent and used to link users to this role.</p></div>
            <div><Label htmlFor="role-name">Role name</Label><Input id="role-name" value={roleName} onChange={(event) => setRoleName(event.target.value)} placeholder="Support Agent" required disabled={Boolean(editingRole?.isSystem)} /></div>
            <div><Label htmlFor="role-status">Status</Label><select id="role-status" className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value as RoleStatus)} disabled={Boolean(editingRole?.isSystem)}>{STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Permissions</legend>
              {ENTITIES.map((entity) => <div className="rounded-lg border p-3" key={entity}>
                <h3 className="mb-2 font-medium">{entity}</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {ACTIONS.map((action) => {
                    const permission = `${entity}:${action}` as Permission;
                    return <label key={permission} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={permissions.includes(permission)} onChange={(event) => togglePermission(permission, event.target.checked)} />{action}
                    </label>;
                  })}
                </div>
              </div>)}
            </fieldset>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : editingRole ? "Save changes" : "Create role"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default RolesManagement;
