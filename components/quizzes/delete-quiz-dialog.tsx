"use client";

import { useState } from "react";
import { useQuizzes, type Quiz } from "@/hooks/use-quizzes";
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
import { Loader2 } from "lucide-react";

interface DeleteQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: Quiz | null;
  onDeleteComplete?: () => void;
}

export function DeleteQuizDialog({
  open,
  onOpenChange,
  quiz,
  onDeleteComplete,
}: DeleteQuizDialogProps) {
  const { deleteQuiz: deleteQuizMutation } = useQuizzes();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!quiz) return;

    try {
      setIsLoading(true);
      await deleteQuizMutation(quiz._id);
      onOpenChange(false);
      onDeleteComplete?.();
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{quiz?.title}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end pt-6">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
