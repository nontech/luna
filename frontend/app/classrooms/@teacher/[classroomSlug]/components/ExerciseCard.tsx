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
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {exercise.instructions || "Yet to add instructions..."}
        </p>
        <div className="flex justify-end">
          <Link
            href={`/classrooms/${classroomSlug}/${exercise.slug}?id=${exercise.id}`}
            className="text-primary hover:underline inline-flex items-center"
          >
            Enter Exercise
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
