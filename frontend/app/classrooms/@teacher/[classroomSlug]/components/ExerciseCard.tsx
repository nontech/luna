import { Exercise } from "@/types/exercise";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import MoreExerciseActions from "./MoreExerciseActions";
import Link from "next/link";

interface ExerciseCardProps {
  exercise: Exercise;
  classroomSlug: string;
  onExerciseUpdate: () => Promise<void>;
}

export function ExerciseCard({
  exercise,
  classroomSlug,
  onExerciseUpdate,
}: ExerciseCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{exercise.name}</CardTitle>
        <MoreExerciseActions
          exercise={exercise}
          classroomSlug={classroomSlug}
          onExerciseUpdate={onExerciseUpdate}
        />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {exercise.instructions.substring(0, 100)}
          {exercise.instructions.length > 100 ? "..." : ""}
        </p>
        <Link
          href={`/classrooms/${classroomSlug}/${exercise.slug}?id=${exercise.id}`}
          className="text-primary hover:underline mt-2 inline-block"
        >
          View exercise
        </Link>
      </CardContent>
    </Card>
  );
}
