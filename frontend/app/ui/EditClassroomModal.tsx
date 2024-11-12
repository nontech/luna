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

interface Classroom {
  id: number;
  name: string;
  description: string;
  slug: string;
}

interface EditClassroomModalProps {
  classroom: Classroom;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditClassroomModal({
  classroom,
  isOpen,
  onClose,
}: EditClassroomModalProps) {
  const [classroomName, setClassroomName] = useState(classroom.name);
  const [description, setDescription] = useState(
    classroom.description
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/classrooms/${classroom.slug}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: classroomName,
            description: description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update classroom");
      }

      onClose();
      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
      // Optionally show error to user
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update classroom"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges =
    classroomName !== classroom.name ||
    description !== classroom.description;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Classroom</DialogTitle>
          <DialogDescription>
            Make changes to your classroom details.
          </DialogDescription>
        </DialogHeader>
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
        </div>
        <DialogFooter>
          <Button
            onClick={handleUpdate}
            disabled={
              isUpdating || !hasChanges || !classroomName.trim()
            }
          >
            {isUpdating ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
