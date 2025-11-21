"use client";

import { useState, useRef } from "react";
import { useQuizzes } from "@/hooks/use-quizzes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Loader2, Upload as UploadIcon } from "lucide-react";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: () => void;
}

export function BulkUploadQuizzesDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: BulkUploadDialogProps) {
  const { bulkUpload } = useQuizzes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please select a CSV file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await bulkUpload(file);
      setUploadResult(result);
      onUploadComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Upload Quizzes</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add multiple quizzes at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <div className="space-y-2 text-sm">
            <p className="font-medium">CSV Format:</p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
              {`title,description,subject,category,level,duration,xp_reward,difficulty_score,tags
Algebra Quiz,Basic algebra concepts,Mathematics,Algebra,Form 1,1800,50,1.5,algebra|equations`}
            </pre>
          </div>

          {/* File Upload */}
          {!uploadResult ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="hidden"
                />
                <div className="space-y-3">
                  <UploadIcon className="h-10 w-10 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">
                      {file ? file.name : "No file selected"}
                    </p>
                    {!file && (
                      <p className="text-sm text-muted-foreground">
                        CSV files only, max 10MB
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    Choose File
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                  <p className="text-destructive">{error}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isLoading || !file}
                  className="gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Upload
                </Button>
              </div>
            </div>
          ) : (
            /* Success Result */
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-medium text-green-900 mb-2">
                  Upload Successful!
                </p>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>✓ {uploadResult.imported_count} quiz(zes) imported</li>
                  {uploadResult.failed_count > 0 && (
                    <li className="text-red-700">
                      ✗ {uploadResult.failed_count} quiz(zes) failed
                    </li>
                  )}
                </ul>
              </div>

              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="font-medium text-yellow-900 mb-2 text-sm">
                    Import Errors:
                  </p>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    {uploadResult.errors
                      .slice(0, 5)
                      .map((err: any, idx: number) => (
                        <li key={idx}>
                          Row {err.row}: {err.error}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <Button onClick={handleReset} className="w-full">
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
