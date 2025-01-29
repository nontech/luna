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
      <div className="text-center py-8">
        <p className="text-gray-500">
          You haven&apos;t created any exercises yet.
        </p>
        <p className="text-gray-500">
          Click &quot;Create Exercise&quot; to add your first
          exercise!
        </p>
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
