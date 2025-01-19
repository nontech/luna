"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function TeacherExerciseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const classroomSlug = params.classroomSlug as string;

  return (
    <div className="p-4">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>
          {error.message ||
            "Something went wrong while loading the exercise"}
        </p>
        <div className="mt-4 space-x-4">
          <button
            onClick={reset}
            className="text-red-600 hover:text-red-800 hover:underline"
          >
            Try again
          </button>
          <Link
            href={`/classrooms/${classroomSlug}`}
            className="text-red-600 hover:text-red-800 hover:underline"
          >
            Return to classroom
          </Link>
        </div>
      </div>
    </div>
  );
}
