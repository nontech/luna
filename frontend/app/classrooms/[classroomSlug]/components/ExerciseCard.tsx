import { Exercise } from "@/types/exercise";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ExerciseActions } from "./ExerciseActions";
import Link from "next/link";

interface ExerciseCardProps {
  exercise: Exercise;
  classroomSlug: string;
}

export function ExerciseCard({
  exercise,
  classroomSlug,
}: ExerciseCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{exercise.name}</CardTitle>
        <ExerciseActions
          exercise={exercise}
          classroomSlug={classroomSlug}
        />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {exercise.instructions.substring(0, 100)}
          {exercise.instructions.length > 100 ? "..." : ""}
        </p>
        <Link
          href={`/classrooms/${classroomSlug}/${exercise.slug}?id=${exercise.id}`}
        >
          Go to exercise
        </Link>
      </CardContent>
    </Card>
  );
}
