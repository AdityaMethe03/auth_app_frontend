import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import useAuth from "@/auth/store";
import { useState } from "react";
import { updateUserProfile } from "@/services/AuthService";
import toast from "react-hot-toast";
import ChangePasswordDialog from "@/components/ChangePasswordDialog.tsx";

function Userprofile() {
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuth((state) => state.user);
  const changeLocalLoginData = useAuth((state) => state.changeLocalLoginData);
  const accessToken = useAuth((state) => state.accessToken);

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const updatedUser = await updateUserProfile(
        user.id,
        name,
        `test/img/url/${user.id}.png`,
      );
      changeLocalLoginData(accessToken!, updatedUser, true);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  console.log(user);
  // val isEnabled
  console.log(user?.enable ? "Yes" : "No");

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center"
      >
        User Profile
      </motion.h1>

      {/* Profile Card */}
      <Card className="rounded-2xl shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-28 h-28 border shadow-md">
              <AvatarImage src="https://api.dicebear.com/7.x/thumbs/svg?seed=user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="rounded-xl px-5">
              Change Pictures
            </Button>
          </div>

          {/* User Details */}
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={user?.name}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  value={user?.provider}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enabled">Enabled</Label>
                <Input
                  id="enabled"
                  value={user?.enable ? "Yes" : "No"}
                  readOnly
                  className="rounded-xl"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  value={user?.provider}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enabled">Enabled</Label>
                <Input
                  id="enabled"
                  value={user?.enable ? "Yes" : "No"}
                  readOnly
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full rounded-2xl mt-4 text-lg"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex w-full gap-3 mt-4">
              <Button
                className="flex-1 rounded-2xl"
                onClick={() => {
                  setName(user?.name || "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={loading}
                className="flex-1 rounded-2xl"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Section */}
      <Card className="rounded-2xl shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setIsPasswordDialogOpen(true)}
            variant="outline"
            className="w-full rounded-xl py-3 text-base"
          >
            Change Password
          </Button>
          <Button
            variant="destructive"
            className="w-full rounded-xl py-3 text-base"
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <ChangePasswordDialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
          userId={user?.id || ""}
      />
    </div>
  );
}

export default Userprofile;
