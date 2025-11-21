"use client";

import type React from "react";
import { useState } from "react";
import { useLevels } from "@/hooks/use-levels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Edit } from "lucide-react";
import type { Level } from "@/hooks/use-levels";

const SUBJECTS = ["Mathematics", "Geography", "English", "History", "Science"];
const FORM_LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"];
const STATUS_OPTIONS = ["active", "draft", "inactive"] as const;

interface EditLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: Level;
}

export function EditLevelDialog({
  open,
  onOpenChange,
  level,
}: EditLevelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    level_number: String(level.level_number),
    title: level.title,
    form_level: level.form_level,
    subject: level.subject,
    description: level.description || "",
    status: level.status as (typeof STATUS_OPTIONS)[number],
    difficulty_rating: String(level.difficulty_rating),
    total_xp_reward: String(level.total_xp_reward),
    bonus_coins: String(level.bonus_coins),
    xp_required: String(level.xp_required),
    completion_percentage_required: String(
      level.completion_percentage_required
    ),
  });

  const { updateLevel } = useLevels();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.level_number) throw new Error("Level number is required");
      if (!formData.title.trim()) throw new Error("Title is required");

      await updateLevel(level._id, {
        level_number: Number(formData.level_number),
        title: formData.title,
        form_level: formData.form_level,
        subject: formData.subject,
        description: formData.description || undefined,
        status: formData.status,
        difficulty_rating: Number(formData.difficulty_rating),
        total_xp_reward: Number(formData.total_xp_reward),
        bonus_coins: Number(formData.bonus_coins),
        xp_required: Number(formData.xp_required),
        completion_percentage_required: Number(
          formData.completion_percentage_required
        ),
      });

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update level");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Edit className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <DialogTitle>Edit Level</DialogTitle>
              <DialogDescription className="mt-1">
                Update the details of this level
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="level_number">Level Number</Label>
                <Input
                  id="level_number"
                  type="number"
                  min="1"
                  value={formData.level_number}
                  onChange={(e) =>
                    setFormData({ ...formData, level_number: e.target.value })
                  }
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subject: value })
                  }
                >
                  <SelectTrigger id="subject" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="form_level">Form Level</Label>
                <Select
                  value={formData.form_level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, form_level: value })
                  }
                >
                  <SelectTrigger id="form_level" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORM_LEVELS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={2}
              />
            </div>
          </div>

          {/* Level Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Level Settings</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="difficulty_rating">Difficulty Rating</Label>
                <Select
                  value={formData.difficulty_rating}
                  onValueChange={(value) =>
                    setFormData({ ...formData, difficulty_rating: value })
                  }
                >
                  <SelectTrigger
                    id="difficulty_rating"
                    className="bg-background"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}/5
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="space-y-4">
            <h3 className="font-semibold">Rewards & Requirements</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="total_xp_reward">Total XP Reward</Label>
                <Input
                  id="total_xp_reward"
                  type="number"
                  min="0"
                  value={formData.total_xp_reward}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_xp_reward: e.target.value,
                    })
                  }
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bonus_coins">Bonus Coins</Label>
                <Input
                  id="bonus_coins"
                  type="number"
                  min="0"
                  value={formData.bonus_coins}
                  onChange={(e) =>
                    setFormData({ ...formData, bonus_coins: e.target.value })
                  }
                  className="bg-background"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="xp_required">XP Required to Unlock</Label>
                <Input
                  id="xp_required"
                  type="number"
                  min="0"
                  value={formData.xp_required}
                  onChange={(e) =>
                    setFormData({ ...formData, xp_required: e.target.value })
                  }
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completion_percentage_required">
                  Completion % Required
                </Label>
                <Input
                  id="completion_percentage_required"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.completion_percentage_required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      completion_percentage_required: e.target.value,
                    })
                  }
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="bg-background"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
