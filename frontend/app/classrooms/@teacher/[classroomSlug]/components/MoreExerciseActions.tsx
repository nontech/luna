"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Exercise } from "@/types/exercise";
import EditExerciseModal from "./EditExerciseModal";
import DeleteExerciseModal from "./DeleteExerciseModal";

interface MoreExerciseActionsProps {
  exercise: Exercise;
  classroomSlug: string;
  onExerciseUpdate: () => Promise<void>;
}

export default function MoreExerciseActions({
  exercise,
  classroomSlug,
  onExerciseUpdate,
}: MoreExerciseActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
            Edit Exercise
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-600"
          >
            Delete Exercise
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditExerciseModal
        exercise={exercise}
        classroomSlug={classroomSlug}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          onExerciseUpdate();
        }}
      />

      <DeleteExerciseModal
        exercise={exercise}
        classroomSlug={classroomSlug}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          onExerciseUpdate();
        }}
      />
    </>
  );
}
