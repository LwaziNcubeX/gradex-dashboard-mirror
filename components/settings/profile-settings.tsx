"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Loader2 } from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfile";

export function ProfileSettingsCard() {
  const { profile, loading, error, fetchProfile, updateUserProfile } =
    useProfile();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    // Fetch profile on mount
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    // Update form when profile data is fetched
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setSaveMessage("First name and last name are required");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      await updateUserProfile(firstName, lastName);
      setSaveMessage("Profile updated successfully");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveMessage(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-foreground">Profile Settings</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your admin account details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  First Name
                </Label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Last Name
                </Label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                Email
              </Label>
              <Input
                type="email"
                value={profile?.email || ""}
                readOnly
                className="bg-secondary/50 border-border text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>

            {saveMessage && (
              <div
                className={`text-sm p-3 rounded-lg ${
                  error
                    ? "bg-destructive/10 text-destructive"
                    : "bg-green-600/10 text-green-600"
                }`}
              >
                {saveMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSaving || loading}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
