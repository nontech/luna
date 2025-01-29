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
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Exercise } from "@/types/exercise";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface DeleteExerciseModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
  onExerciseDeleted?: () => void;
}

export default function DeleteExerciseModal({
  exercise,
  isOpen,
  onClose,
  onExerciseDeleted,
}: DeleteExerciseModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetchFromDjangoClient(
        `exercise/delete/${exercise.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete exercise");
      }

      setIsSuccess(true);

      // Close modal and refresh data after successful deletion
      setTimeout(() => {
        onClose();
        router.refresh();
        onExerciseDeleted?.();
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete exercise"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Delete Exercise
          </DialogTitle>
          <DialogDescription className="pt-4">
            Are you sure you want to delete the exercise{" "}
            <span className="font-semibold">{exercise.name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <>
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Exercise"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center text-green-600">
            <p className="text-lg font-semibold">
              Exercise Deleted Successfully!
            </p>
            <p className="mt-2">Refreshing exercise list...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
