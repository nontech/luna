import { Exercise } from "@/types/exercise";
import { ExerciseCard } from "./ExerciseCard";

interface ExerciseListProps {
  exercises: Exercise[];
  classroomSlug: string;
  onExerciseUpdate: () => Promise<void>;
}

export function ExerciseList({
  exercises,
  classroomSlug,
  onExerciseUpdate,
}: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No exercises found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          classroomSlug={classroomSlug}
          onExerciseUpdate={onExerciseUpdate}
        />
      ))}
    </div>
  );
}
