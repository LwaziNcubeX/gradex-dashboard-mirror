"use client";

import type React from "react";
import { useState } from "react";
import { useQuestions } from "@/hooks/use-questions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Upload,
  AlertCircle,
  CheckCircle,
  FileUp,
} from "lucide-react";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkUploadDialog({
  open,
  onOpenChange,
}: BulkUploadDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    imported: number;
    failed: number;
  } | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { bulkUpload } = useQuestions();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please select a CSV file");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await bulkUpload(file);
      setSuccess({
        imported: result.imported_count,
        failed: result.failed_count,
      });
      setFile(null);

      setTimeout(() => {
        onOpenChange(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload questions"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <FileUp className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <DialogTitle>Bulk Upload Questions</DialogTitle>
              <DialogDescription className="mt-1">
                Upload multiple questions from a CSV file
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-50 p-4 dark:bg-green-950/30">
              <CheckCircle className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
              <span className="text-sm text-green-600 dark:text-green-400">
                Successfully imported {success.imported} questions
                {success.failed > 0 && ` (${success.failed} failed)`}
              </span>
            </div>
          )}

          {/* CSV Format Info */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="font-medium text-sm text-foreground mb-2">
              CSV Format:
            </p>
            <code className="block text-xs font-mono text-muted-foreground break-all bg-background/50 p-2 rounded border border-border">
              question_text,answers,correct_answer,subject,topic,level,explanation
            </code>
            <p className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium">Note:</span> Separate multiple
              answers with pipe character: "Option 1|Option 2|Option 3"
            </p>
          </div>

          {/* File Input */}
          <div className="space-y-3">
            <label htmlFor="file" className="block text-sm font-medium">
              Select CSV File
            </label>
            <div className="relative">
              <input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="sr-only"
              />
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Click to upload CSV file
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or drag and drop
                  </p>
                </div>
              </label>
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected:{" "}
                <span className="font-medium text-foreground">{file.name}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !file}
              className="gap-2 bg-accent hover:bg-accent/90"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
