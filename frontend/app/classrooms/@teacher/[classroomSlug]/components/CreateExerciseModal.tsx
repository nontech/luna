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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface CreateExerciseModalProps {
  classroomSlug: string;
}

export default function CreateExerciseModal({
  classroomSlug,
}: CreateExerciseModalProps) {
  const [open, setOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetchFromDjangoClient(
        `api/classrooms/${classroomSlug}/exercises/create/`,
        {
          method: "POST",
          body: JSON.stringify({
            name: exerciseName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create exercise");
      }

      setIsSuccess(true);

      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setExerciseName("");
        router.push(
          `/classrooms/${classroomSlug}/${data.slug}?id=${data.id}`
        );
      }, 1500);
    } catch (error) {
      console.error("Error creating exercise:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Exercise</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Exercise</DialogTitle>
          <DialogDescription>
            Enter a name for your new exercise.
          </DialogDescription>
        </DialogHeader>
        {!isSuccess ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter exercise name"
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreate}
                disabled={isCreating || !exerciseName.trim()}
              >
                {isCreating ? "Creating..." : "Create Exercise"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center text-green-600">
            <p className="text-lg font-semibold">
              Exercise Created Successfully!
            </p>
            <p className="mt-2">Closing...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
