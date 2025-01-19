"use client";

import { notFound } from "next/navigation";
import { ExerciseList } from "./components/ExerciseList";
import { Exercise } from "@/types/exercise";
import CreateExerciseModal from "./components/CreateExerciseModal";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

interface PageProps {
  params: { classroomSlug: string };
}

export default function ClassroomPage({ params }: PageProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const params2 = useParams();
  const classroomSlug = params2.classroomSlug as string;

  const fetchExercises = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/classrooms/${classroomSlug}/exercises`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }

      const data = await response.json();
      setExercises(data.exercises || []);
    } catch (error) {
      console.log("Error:", error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }, [classroomSlug]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
          onExerciseUpdate={fetchExercises}
        />
      </div>
    </div>
  );
}
