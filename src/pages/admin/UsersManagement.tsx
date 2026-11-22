import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/auth/store";
import { hasPermission } from "@/auth/permissions";
import type User from "@/models/User";
import type Role from "@/models/Role";
import {
  createManagedUser,
  deleteManagedUser,
  getAllRoles,
  getAllTenants,
  getAllUsers,
  updateManagedUser,
  type Tenant,
} from "@/services/AuthService";
import toast from "react-hot-toast";

function UsersManagement() {
  const currentUser = useAuth((state) => state.user);
  const changeLocalLoginData = useAuth((state) => state.changeLocalLoginData);
  const accessToken = useAuth((state) => state.accessToken);
  const isPlatformAdmin =
    currentUser?.tenantId === "SYSTEM" && currentUser.roles?.includes("SUDO_ADMIN");
  const targetTenantId = isPlatformAdmin ? "SYSTEM" : currentUser?.tenantId;
  const canCreate = hasPermission(currentUser, "USER:WRITE");
  const canUpdate = hasPermission(currentUser, "USER:UPDATE");
  const canDelete = hasPermission(currentUser, "USER:DELETE");
  const canAssignRoles = hasPermission(currentUser, "ROLE:UPDATE");
  const canEditAll = canUpdate && canAssignRoles;

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [assignedRoles, setAssignedRoles] = useState<string[]>([]);
  const [createTenantId, setCreateTenantId] = useState("SYSTEM");
  const [newRoles, setNewRoles] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState<User["status"]>("ACTIVE");

  const availableCreateRoles = useMemo(
    () => roles.filter((role) =>
      role.tenantId === createTenantId
      && role.status === "ACTIVE"
      && role.identifier !== "SUDO_ADMIN",
    ),
    [createTenantId, roles],
  );
  const editableRoles = useMemo(
    () => roles.filter((role) =>
      role.tenantId === editingUser?.tenantId
      && role.status === "ACTIVE"
      && role.identifier !== "SUDO_ADMIN"
      && (isPlatformAdmin || role.identifier !== "SYS_ADMIN"),
    ),
    [editingUser?.tenantId, isPlatformAdmin, roles],
  );
  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) =>
      [user.tenantId, user.name, user.email, ...(user.roles ?? [])].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    );
  }, [search, users]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [userRows, roleRows, tenantRows] = await Promise.all([
        getAllUsers(targetTenantId),
        hasPermission(currentUser, "ROLE:READ") ? getAllRoles(targetTenantId) : Promise.resolve([]),
        isPlatformAdmin ? getAllTenants() : Promise.resolve([]),
      ]);
      setUsers(userRows);
      setRoles(roleRows);
      setTenants(tenantRows);
    } catch (error) {
      console.error("Unable to load user administration data", error);
      toast.error("Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, [currentUser, isPlatformAdmin, targetTenantId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function defaultRoleForTenant(tenantId: string) {
    const tenantRoles = roles.filter((role) =>
      role.tenantId === tenantId && role.status === "ACTIVE" && role.identifier !== "SUDO_ADMIN",
    );
    return tenantRoles.find((role) => role.identifier === "USER")?.identifier
      ?? tenantRoles[0]?.identifier;
  }

  function openCreateDialog() {
    const tenantId = isPlatformAdmin ? "SYSTEM" : (targetTenantId ?? "");
    setCreateTenantId(tenantId);
    const defaultRole = defaultRoleForTenant(tenantId);
    setNewRoles(defaultRole ? [defaultRole] : []);
    setName("");
    setEmail("");
    setPassword("");
    setCreateOpen(true);
  }

  function changeCreateTenant(tenantId: string) {
    setCreateTenantId(tenantId);
    const defaultRole = defaultRoleForTenant(tenantId);
    setNewRoles(defaultRole ? [defaultRole] : []);
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await createManagedUser({
        email: email.trim(),
        name: name.trim(),
        password,
        roles: isPlatformAdmin ? newRoles : ["USER"],
      }, isPlatformAdmin ? createTenantId : targetTenantId);
      toast.success("User created.");
      setCreateOpen(false);
      await loadData();
    } catch (error) {
      console.error("Unable to create user", error);
      toast.error("Unable to create user.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(user: User) {
    setEditingUser(user);
    setName(user.name ?? "");
    setEnabled(user.enable);
    setStatus(user.status ?? "ACTIVE");
    const userRoles = roles.filter((role) =>
      role.tenantId === user.tenantId
      && role.status === "ACTIVE"
      && role.identifier !== "SUDO_ADMIN"
      && (isPlatformAdmin || role.identifier !== "SYS_ADMIN"),
    );
    setAssignedRoles(
      (user.roles ?? []).filter(
        (identifier) => userRoles.some((role) => role.identifier === identifier)
          || (!isPlatformAdmin && identifier === "SYS_ADMIN"),
      ),
    );
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      const updated = await updateManagedUser(editingUser.id, {
        name: name.trim(),
        enable: enabled,
        status,
        roles: assignedRoles,
      }, editingUser.tenantId);
      setUsers((rows) => rows.map((row) =>
        row.id === updated.id && row.tenantId === updated.tenantId ? updated : row,
      ));
      if (updated.id === currentUser?.id && updated.tenantId === currentUser.tenantId && accessToken) {
        changeLocalLoginData(accessToken, updated, true);
      }
      toast.success("User updated.");
      setEditingUser(null);
    } catch (error) {
      console.error("Unable to update user", error);
      toast.error("Unable to update user.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user: User) {
    if (!window.confirm(`Delete the account for ${user.email}?`)) return;
    try {
      await deleteManagedUser(user.id, user.tenantId);
      setUsers((rows) => rows.filter((row) => row.id !== user.id || row.tenantId !== user.tenantId));
      toast.success("User deleted.");
    } catch (error) {
      console.error("Unable to delete user", error);
      toast.error("Unable to delete user.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Administration</p>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="mt-1 text-muted-foreground">
            {isPlatformAdmin ? "Manage users across all tenants." : "Create accounts and manage user access."}
          </p>
        </div>
        {canCreate && <Button onClick={openCreateDialog}>Create user</Button>}
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>User directory</CardTitle>
          <Input className="max-w-xs" placeholder="Search tenant, name, email, or role" value={search} onChange={(event) => setSearch(event.target.value)} />
        </CardHeader>
        <CardContent>
          {loading ? <p className="py-8 text-center text-muted-foreground">Loading users…</p> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    {isPlatformAdmin && <th className="p-3">Tenant code</th>}
                    <th className="p-3">User</th><th className="p-3">Roles</th><th className="p-3">Status</th><th className="p-3">Enabled</th><th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user) => {
                    const isSudo = user.roles?.includes("SUDO_ADMIN") ?? false;
                    const roleNames = (user.roles ?? []).map((identifier) =>
                      roles.find((role) => role.tenantId === user.tenantId && role.identifier === identifier)?.name ?? identifier,
                    );
                    return <tr className="border-b last:border-0" key={`${user.tenantId}:${user.id}`}>
                      {isPlatformAdmin && <td className="p-3 font-mono text-xs">{user.tenantId}</td>}
                      <td className="p-3"><div className="font-medium">{user.name || "Unnamed user"}</div><div className="text-muted-foreground">{user.email}</div></td>
                      <td className="p-3">{roleNames.join(", ") || "—"}</td>
                      <td className="p-3">{user.status ?? "—"}</td>
                      <td className="p-3">{user.enable ? "Yes" : "No"}</td>
                      <td className="p-3"><div className="flex justify-end gap-2">
                        {canEditAll && !isSudo && <Button size="sm" variant="outline" onClick={() => startEditing(user)}>Edit</Button>}
                        {canDelete && !isSudo && user.id !== currentUser?.id && <Button size="sm" variant="destructive" onClick={() => void handleDelete(user)}>Delete</Button>}
                      </div></td>
                    </tr>;
                  })}
                  {!visibleUsers.length && <tr><td className="p-8 text-center text-muted-foreground" colSpan={isPlatformAdmin ? 6 : 5}>No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent><DialogHeader><DialogTitle>Create user</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleCreate}>
            {isPlatformAdmin && <div className="space-y-2"><Label htmlFor="new-user-tenant">Tenant</Label><select id="new-user-tenant" className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={createTenantId} onChange={(event) => changeCreateTenant(event.target.value)}>{tenants.filter((tenant) => tenant.status === "ACTIVE").map((tenant) => <option key={tenant.tenantCode} value={tenant.tenantCode}>{tenant.name} ({tenant.tenantCode})</option>)}</select></div>}
            <div><Label htmlFor="new-user-name">Name</Label><Input id="new-user-name" value={name} onChange={(event) => setName(event.target.value)} required /></div>
            <div><Label htmlFor="new-user-email">Email</Label><Input id="new-user-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            <div><Label htmlFor="new-user-password">Temporary password</Label><Input id="new-user-password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
            {isPlatformAdmin ? <div className="space-y-2"><Label>Roles</Label><div className="max-h-48 space-y-2 overflow-y-auto">{availableCreateRoles.map((role) => <label key={role.id} className="flex items-center gap-2 rounded-md border p-3 text-sm"><input type="checkbox" checked={newRoles.includes(role.identifier)} onChange={(event) => setNewRoles((current) => event.target.checked ? [...current, role.identifier] : current.filter((identifier) => identifier !== role.identifier))} /><span>{role.name} <span className="text-muted-foreground">({role.identifier})</span></span></label>)}{!availableCreateRoles.length && <p className="text-sm text-muted-foreground">Create an assignable role for this tenant first.</p>}</div></div> : <p className="text-sm text-muted-foreground">New accounts start with the USER role.</p>}
            <DialogFooter><Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button type="submit" disabled={saving || (isPlatformAdmin && newRoles.length === 0)}>{saving ? "Creating…" : "Create user"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingUser)} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit user</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div><Label htmlFor="edit-user-name">Name</Label><Input id="edit-user-name" value={name} onChange={(event) => setName(event.target.value)} required /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /> Account enabled</label>
            <div className="space-y-2"><Label htmlFor="edit-user-status">Status</Label><select id="edit-user-status" className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={status} onChange={(event) => setStatus(event.target.value as User["status"])}>{["ACTIVE", "PENDING", "REVIEW", "INACTIVE", "DELETED"].map((value) => <option key={value} value={value}>{value}</option>)}</select></div>
            <div><Label>Roles</Label><div className="max-h-72 space-y-2 overflow-y-auto">
              {editableRoles.map((role) => <label key={role.id} className="flex items-center gap-2 rounded-md border p-3 text-sm"><input type="checkbox" checked={assignedRoles.includes(role.identifier)} onChange={(event) => setAssignedRoles((current) => event.target.checked ? [...current, role.identifier] : current.filter((identifier) => identifier !== role.identifier))} /><span><span className="font-medium">{role.name}</span><span className="ml-2 text-muted-foreground">{role.permissions?.length ?? 0} permissions</span></span></label>)}
              {!isPlatformAdmin && editingUser?.roles?.includes("SYS_ADMIN") && <label className="flex items-center gap-2 rounded-md border p-3 text-sm opacity-70"><input type="checkbox" checked disabled /><span><span className="font-medium">SYS_ADMIN</span><span className="ml-2 text-muted-foreground">Only SUDO_ADMIN can change this role</span></span></label>}
              {!editableRoles.length && <p className="text-sm text-muted-foreground">No active assignable roles are available.</p>}
            </div></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button><Button type="submit" disabled={saving || assignedRoles.length === 0}>{saving ? "Saving…" : "Save changes"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default UsersManagement;
