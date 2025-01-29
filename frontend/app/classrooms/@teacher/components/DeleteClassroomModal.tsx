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
import { Classroom } from "@/types/classroom";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface DeleteClassroomModalProps {
  classroom: Classroom;
  isOpen: boolean;
  onClose: () => void;
  onClassroomUpdate: () => Promise<void>;
  onClassroomDeleted?: () => void;
}

export default function DeleteClassroomModal({
  classroom,
  isOpen,
  onClose,
  onClassroomUpdate,
  onClassroomDeleted,
}: DeleteClassroomModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetchFromDjangoClient(
        `delete_classroom/${classroom.slug}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete classroom");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        onClassroomUpdate();
        router.push("/classrooms");
        onClassroomDeleted?.();
      }, 1500);
    } catch (error) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Delete Classroom
          </DialogTitle>
          <DialogDescription className="pt-4">
            Are you sure you want to delete the classroom{" "}
            <span className="font-semibold">{classroom.name}</span>?
            This action is irreversible and will delete all associated
            exercises.
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
            <p className="mt-2">Refreshing classroom list...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
