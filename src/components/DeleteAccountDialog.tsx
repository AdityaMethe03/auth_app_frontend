import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteUserAccount } from "@/services/AuthService";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/auth/store";
import { useNavigate } from "react-router";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  userId,
  userEmail,
}: DeleteAccountDialogProps) {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!confirmEmail.trim()) {
      toast.error("Please enter your email to confirm");
      return;
    }

    if (confirmEmail !== userEmail) {
      toast.error("Email does not match");
      return;
    }

    try {
      setLoading(true);
      await deleteUserAccount(userId);
      toast.success("Account deleted successfully");

      // Logout user
      await logout();

      // Redirect to home
      navigate("/");
    } catch (error: any) {
      console.log(error);
      const errorMsg =
        error?.response?.data?.message || "Failed to delete account";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Delete Account
          </DialogTitle>
        </DialogHeader>

        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action cannot be undone. Your account and all associated data
            will be permanently deleted.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleDelete} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              To confirm deletion, please enter your email address:
            </p>
            <Label htmlFor="confirmEmail" className="text-base font-semibold">
              {userEmail}
            </Label>
            <Input
              id="confirmEmail"
              type="email"
              placeholder="Enter your email to confirm"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              disabled={loading}
              className="rounded-xl border-destructive/50"
            />
            <p className="text-xs text-muted-foreground">
              Type your email exactly as shown above to confirm deletion.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmEmail("");
                onOpenChange(false);
              }}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || confirmEmail !== userEmail}
              className="rounded-xl"
            >
              {loading ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
