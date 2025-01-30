"use client";

import { notFound } from "next/navigation";
import { ExerciseList } from "./components/ExerciseList";
import { Exercise } from "@/types/exercise";
import CreateExerciseModal from "./components/CreateExerciseModal";
import { useEffect, useCallback, Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface Classroom {
  name: string;
  description: string;
}

function ClassroomDetails({
  classroomSlug,
}: {
  classroomSlug: string;
}) {
  const [classroom, setClassroom] = useState<Classroom | null>(null);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await fetchFromDjangoClient(
          `api/classrooms/${classroomSlug}/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch classroom");
        }

        const data = await response.json();
        setClassroom(data);
      } catch (error) {
        console.error("Error fetching classroom:", error);
      }
    };

    fetchClassroom();
  }, [classroomSlug]);

  if (!classroom) {
    return null;
  }

  return (
    <div className="mb-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {classroom.name}
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed">
        {classroom.description}
      </p>
      <div className="h-px bg-gray-200 w-full mt-6"></div>
    </div>
  );
}

function ExerciseListWrapper({
  classroomSlug,
}: {
  classroomSlug: string;
}) {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const fetchExercises = useCallback(async () => {
    try {
      const response = await fetchFromDjangoClient(
        `api/classrooms/${classroomSlug}/exercises/`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }

      const data = await response.json();
      setExercises(data.exercises || []);
    } catch (error) {
      setExercises([]); // Clear exercises on error
      throw error; // This will trigger the error boundary
    }
  }, [classroomSlug]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  if (!exercises) {
    notFound();
  }

  return (
    <ExerciseList
      exercises={exercises}
      classroomSlug={classroomSlug}
      onExerciseUpdate={fetchExercises}
    />
  );
}

export default function TeacherClassroomPage() {
  const params2 = useParams();
  const classroomSlug = params2.classroomSlug as string;

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <ClassroomDetails classroomSlug={classroomSlug} />
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Exercises</h2>
          <CreateExerciseModal classroomSlug={classroomSlug} />
        </div>
        <Suspense>
          <ExerciseListWrapper classroomSlug={classroomSlug} />
        </Suspense>
      </div>
    </div>
  );
}
