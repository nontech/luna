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
import { useRouter } from "next/navigation";
import { Exercise } from "@/types/exercise";

interface EditExerciseModalProps {
  exercise: Exercise;
  classroomSlug: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditExerciseModal({
  exercise,
  classroomSlug,
  isOpen,
  onClose,
}: EditExerciseModalProps) {
  const [formData, setFormData] = useState({
    name: exercise.name,
    instructions: exercise.instructions,
    output_instructions: exercise.output_instructions,
    code: exercise.code,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/exercise/${exercise.id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update exercise");
      }

      setIsSuccess(true);

      // Close modal and refresh data after successful update
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update exercise"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges =
    formData.name !== exercise.name ||
    formData.instructions !== exercise.instructions ||
    formData.output_instructions !== exercise.output_instructions ||
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
                <Label htmlFor="output">Output Instructions</Label>
                <Textarea
                  id="output"
                  value={formData.output_instructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      output_instructions: e.target.value,
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
