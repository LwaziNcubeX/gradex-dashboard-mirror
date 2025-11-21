"use client";

import { useState } from "react";
import { useLevels } from "@/hooks/use-levels";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import type { Level } from "@/hooks/use-levels";

interface DeleteLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: Level;
}

export function DeleteLevelDialog({
  open,
  onOpenChange,
  level,
}: DeleteLevelDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteLevel } = useLevels();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLevel(level._id);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to delete level:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle>Delete Level</AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                Are you sure you want to delete <strong>{level.title}</strong>?
                This action cannot be undone. All data associated with this
                level will be permanently removed.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
