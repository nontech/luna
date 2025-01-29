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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface CreateExerciseModalProps {
  classroomSlug: string;
}

export default function CreateExerciseModal({
  classroomSlug,
}: CreateExerciseModalProps) {
  const [open, setOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [outputInstructions, setOutputInstructions] = useState("");
  const [code, setCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/classrooms/${classroomSlug}/exercises/create-exercise`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: exerciseName,
            instructions,
            output_instructions: outputInstructions,
            code,
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
        setInstructions("");
        setOutputInstructions("");
        setCode("");
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
            Enter details for your new exercise. Click create when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {!isSuccess ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter exercise name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instructions" className="text-right">
                  Instructions
                </Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter exercise instructions"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="output" className="text-right">
                  Output
                </Label>
                <Textarea
                  id="output"
                  value={outputInstructions}
                  onChange={(e) =>
                    setOutputInstructions(e.target.value)
                  }
                  className="col-span-3"
                  placeholder="Enter expected output"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Initial Code
                </Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter initial code template"
                  rows={4}
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
