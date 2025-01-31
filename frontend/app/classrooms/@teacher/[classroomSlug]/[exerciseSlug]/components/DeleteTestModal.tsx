"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface DeleteTestModalProps {
  test: {
    id: string;
    name: string;
  };
  onTestDeleted?: () => void;
}

export default function DeleteTestModal({
  test,
  onTestDeleted,
}: DeleteTestModalProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetchFromDjangoClient(
        `api/tests/${test.id}/delete/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete test");
      }

      setOpen(false);
      onTestDeleted?.();
    } catch (error) {
      console.error("Error deleting test:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Test</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the test &quot;{test.name}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
