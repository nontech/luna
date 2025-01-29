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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Exercise } from "@/types/exercise";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface EditExerciseModalProps {
  exercise: Exercise;
  classroomSlug: string;
  isOpen: boolean;
  onClose: () => void;
  onExerciseUpdated: (updatedExercise: Exercise) => void;
}

export default function EditExerciseModal({
  exercise,
  classroomSlug,
  isOpen,
  onClose,
  onExerciseUpdated,
}: EditExerciseModalProps) {
  const [formData, setFormData] = useState({
    name: exercise.name,
    instructions: exercise.instructions,
    code: exercise.code,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetchFromDjangoClient(
        `exercise/update/${exercise.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name,
            instructions: formData.instructions,
            code: formData.code,
            classroomSlug,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update exercise");
      }

      setIsSuccess(true);
      onExerciseUpdated(data);

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Error updating exercise:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges =
    formData.name !== exercise.name ||
    formData.instructions !== exercise.instructions ||
    formData.code !== exercise.code;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogDescription>
            Make changes to your exercise here.
          </DialogDescription>
        </DialogHeader>
        {!isSuccess ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructions: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Initial Code</Label>
                <Textarea
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={
                  isUpdating || !hasChanges || !formData.name.trim()
                }
              >
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center text-green-600">
            <p className="text-lg font-semibold">
              Exercise Updated Successfully!
            </p>
            <p className="mt-2">Refreshing exercise list...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
