"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Exercise {
  id: string;
  name: string;
  instructions: string;
  code: string;
  output_instructions: string;
  creator: {
    id: number;
    full_name: string;
    username: string;
  };
}

export default function TeacherExercisePage() {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const exerciseId = searchParams.get("id");

  useEffect(() => {
    async function getExerciseDetails() {
      if (!exerciseId) return;

      const response = await fetch(`/api/exercise/${exerciseId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "Exercise not found"
            : "Failed to fetch exercise"
        );
      }

      const data = await response.json();
      setExercise(data);
    }

    getExerciseDetails();
  }, [exerciseId]);

  if (!exercise) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          This is Teacher Exercise Page
        </div>
        <h1 className="text-2xl font-bold">{exercise.name}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Exercise Details
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">
              Instructions
            </h3>
            <p className="mt-1 text-gray-600">
              {exercise.instructions}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700">
              Expected Output
            </h3>
            <p className="mt-1 text-gray-600">
              {exercise.output_instructions}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700">
              Initial Code
            </h3>
            <pre className="mt-1 p-4 bg-gray-50 rounded-md overflow-x-auto">
              <code>{exercise.code}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Student Submissions
        </h2>
        {/* Add submissions list */}
      </div>
    </div>
  );
}
