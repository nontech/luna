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
import { fetchFromDjangoClient } from "@/utils/clientApi";

export default function ClassroomCreator() {
  const [open, setOpen] = useState(false);
  const [classroomName, setClassroomName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetchFromDjangoClient(
        `create_new_classroom`,
        {
          method: "POST",
          body: JSON.stringify({
            name: classroomName,
            description: description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create classroom");
      }

      setIsSuccess(true);

      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setClassroomName("");
        setDescription("");
        router.push(`/classrooms/${data.slug}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating classroom:", error);
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
        <Button variant="outline">Create Classroom</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Classroom</DialogTitle>
          <DialogDescription>
            Enter details for your new classroom. Click create when
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
                  value={classroomName}
                  onChange={(e) => setClassroomName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter classroom name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter classroom description"
                  rows={3}
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
                disabled={isCreating || !classroomName.trim()}
              >
                {isCreating ? "Creating..." : "Create Classroom"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-6 text-center text-green-600">
            <p className="text-lg font-semibold">
              Classroom Created Successfully!
            </p>
            <p className="mt-2">
              Redirecting to your new classroom...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
