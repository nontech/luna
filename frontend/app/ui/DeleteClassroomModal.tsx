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

interface Classroom {
  id: number;
  name: string;
  slug: string;
}

interface DeleteClassroomModalProps {
  classroom: Classroom;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteClassroomModal({
  classroom,
  isOpen,
  onClose,
}: DeleteClassroomModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/classrooms/${classroom.slug}/delete`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete classroom");
      }

      setIsSuccess(true);

      // Redirect after successful deletion
      setTimeout(() => {
        onClose();
        router.push("/classrooms");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Delete error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete classroom"
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
            Delete Classroom
          </DialogTitle>
          <DialogDescription className="pt-4">
            Are you sure you want to delete the classroom{" "}
            <span className="font-semibold">{classroom.name}</span>?
            This action is irreversible.
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
                {isDeleting ? "Deleting..." : "Delete Classroom"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center text-green-600">
            <p className="text-lg font-semibold">
              Classroom Deleted Successfully!
            </p>
            <p className="mt-2">Redirecting to classrooms...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
