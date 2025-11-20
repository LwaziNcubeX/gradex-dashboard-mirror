"use client";

import React, { useState } from "react";
import { useQuestions } from "@/hooks/use-questions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, AlertCircle, CheckCircle } from "lucide-react";

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

      // Close dialog after 2 seconds
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
          <DialogTitle>Bulk Upload Questions</DialogTitle>
          <DialogDescription>
            Upload multiple questions from a CSV file
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>
                Successfully imported {success.imported} questions
                {success.failed > 0 && ` (${success.failed} failed)`}
              </span>
            </div>
          )}

          {/* CSV Format Info */}
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            <p className="font-medium mb-2">CSV Format:</p>
            <code className="block text-xs font-mono break-all">
              question_text,answers,correct_answer,subject,topic,level,explanation
            </code>
            <p className="mt-2 text-xs">
              Separate multiple answers with pipe character: "Option 1|Option
              2|Option 3"
            </p>
          </div>

          {/* File Input */}
          <div className="space-y-2">
            <label htmlFor="file" className="block text-sm font-medium">
              Select CSV File
            </label>
            <input
              id="file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {file && (
              <p className="text-sm text-slate-600">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
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
              className="gap-2"
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
