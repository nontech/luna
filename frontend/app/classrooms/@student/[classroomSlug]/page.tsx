"use client";

import { Exercise } from "@/types/exercise";
import { useEffect, useCallback, Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { fetchFromDjangoClient } from "@/utils/clientApi";
import { StudentExerciseList } from "./components/StudentExerciseList";

function ExerciseListWrapper({
  classroomSlug,
}: {
  classroomSlug: string;
}) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchFromDjangoClient(
        `api/classrooms/${classroomSlug}/exercises/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }

      const data = await response.json();
      setExercises(data.exercises || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
      setExercises([]); // Clear exercises on error
    } finally {
      setIsLoading(false);
    }
  }, [classroomSlug]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">{error}</div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-4">Loading exercises...</div>
    );
  }

  return (
    <StudentExerciseList
      exercises={exercises}
      classroomSlug={classroomSlug}
    />
  );
}

export default function StudentClassroomPage() {
  const params = useParams();
  const classroomSlug = params.classroomSlug as string;

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Exercises</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <ExerciseListWrapper classroomSlug={classroomSlug} />
        </Suspense>
      </div>
    </div>
  );
}
