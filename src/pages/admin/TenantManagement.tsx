import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTenant, getAllTenants, updateTenant, type Tenant } from "@/services/AuthService";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/apiError";

export default function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tenantCode, setTenantCode] = useState("");
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const loadTenants = useCallback(async () => {
    setLoading(true);
    try {
      setTenants(await getAllTenants());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load tenants."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTenants();
  }, [loadTenants]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const tenant = await createTenant({
        tenantCode: tenantCode.trim().toLowerCase(),
        name: name.trim(),
        contactPerson: contactPerson.trim(),
        contactEmail: contactEmail.trim(),
        contactNumber: contactNumber.trim(),
      });
      setTenants((current) => [...current, tenant].sort((left, right) => left.name.localeCompare(right.name)));
      setDialogOpen(false);
      setTenantCode("");
      setName("");
      setContactPerson("");
      setContactEmail("");
      setContactNumber("");
      toast.success("Tenant created. Add its SYS_ADMIN from user management.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create tenant."));
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(tenant: Tenant) {
    try {
      const updated = await updateTenant(tenant.tenantCode, {
        name: tenant.name,
        status: tenant.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      });
      setTenants((current) => current.map((item) => item.tenantCode === tenant.tenantCode ? updated : item));
      toast.success(`Tenant ${updated.status.toLowerCase()}.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update tenant."));
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Platform administration</p>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="mt-1 text-muted-foreground">Create tenant spaces and record their primary contact.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>Create tenant</Button>
      </header>

      <Card>
        <CardHeader><CardTitle>Tenant directory</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="py-8 text-center text-muted-foreground">Loading tenants…</p> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr><th className="p-3">Tenant</th><th className="p-3">Code</th><th className="p-3">Contact person</th><th className="p-3">Contact email</th><th className="p-3">Contact number</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => <tr className="border-b last:border-0" key={tenant.tenantCode}>
                    <td className="p-3"><div className="font-medium">{tenant.name}</div></td>
                    <td className="p-3">{tenant.tenantCode}</td>
                    <td className="p-3">{tenant.contactPerson || "—"}</td>
                    <td className="p-3">{tenant.contactEmail || "—"}</td>
                    <td className="p-3">{tenant.contactNumber || "—"}</td>
                    <td className="p-3">{tenant.status}</td>
                    <td className="p-3"><div className="flex justify-end gap-2">
                      {tenant.tenantCode !== "SYSTEM" && <>
                        <Button size="sm" variant="outline" onClick={() => void toggleStatus(tenant)}>{tenant.status === "ACTIVE" ? "Deactivate" : "Activate"}</Button>
                      </>}
                    </div></td>
                  </tr>)}
                  {!tenants.length && <tr><td className="p-8 text-center text-muted-foreground" colSpan={7}>No tenants found.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create tenant</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div><Label htmlFor="tenant-name">Tenant name</Label><Input id="tenant-name" value={name} onChange={(event) => setName(event.target.value)} required /></div>
            <div><Label htmlFor="tenant-code">Tenant code</Label><Input id="tenant-code" value={tenantCode} onChange={(event) => setTenantCode(event.target.value.toLowerCase())} pattern="[a-z0-9][a-z0-9-]{1,48}[a-z0-9]" minLength={3} maxLength={50} required /><p className="text-xs text-muted-foreground">Used to select this tenant during login.</p></div>
            <div><Label htmlFor="contact-person">Contact person</Label><Input id="contact-person" value={contactPerson} onChange={(event) => setContactPerson(event.target.value)} required /></div>
            <div><Label htmlFor="contact-email">Contact email</Label><Input id="contact-email" type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} required /></div>
            <div><Label htmlFor="contact-number">Contact number</Label><Input id="contact-number" type="tel" value={contactNumber} onChange={(event) => setContactNumber(event.target.value)} required /></div>
            <p className="text-sm text-muted-foreground">System roles are created with the tenant. Add its SYS_ADMIN later from user management.</p>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create tenant"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
