import { notFound } from "next/navigation";
import { ExerciseList } from "./components/ExerciseList";
import { Exercise } from "@/types/exercise";
import CreateExerciseModal from "./components/CreateExerciseModal";

async function getExercises(slug: string): Promise<Exercise[]> {
  try {
    const response = await fetch(
      `${process.env.APP_URL}/api/classrooms/${slug}/exercises`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }

    const data = await response.json();
    return data.exercises;
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
}

interface PageProps {
  params: { classroomSlug: string };
}

export default async function ClassroomPage({ params }: PageProps) {
  const { classroomSlug } = await params;
  // const exercises = await getClassroomExercises(classroomSlug);

  const exercises: Exercise[] = [];

  if (!exercises) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Exercises</h2>
          <CreateExerciseModal classroomSlug={classroomSlug} />
        </div>
        <ExerciseList
          exercises={exercises}
          classroomSlug={classroomSlug}
        />
      </div>
    </div>
  );
}
