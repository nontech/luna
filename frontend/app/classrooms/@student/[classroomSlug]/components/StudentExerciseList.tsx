import { Exercise } from "@/types/exercise";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface StudentExerciseListProps {
  exercises: Exercise[];
  classroomSlug: string;
}

export function StudentExerciseList({
  exercises,
  classroomSlug,
}: StudentExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No exercises available in this classroom yet.
        </p>
        <p className="text-gray-500">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {exercises.map((exercise) => (
        <Card
          key={exercise.id}
          className="hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader>
            <CardTitle className="text-xl">{exercise.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {exercise.instructions}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(
                      exercise.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  href={`/classrooms/${classroomSlug}/${exercise.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Start Exercise →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
