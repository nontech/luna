"use client";

import React from "react";
import ClassroomListCard from "./components/ClassroomListCard";
import CreateClassroomModal from "./components/CreateClassroomModal";

interface Classroom {
  id: number;
  name: string;
  description: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export default function TeacherClassroomPage() {
  const [classrooms, setClassrooms] = React.useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch classrooms
  React.useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch(
          "/api/classrooms/get-all-classrooms",
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch classrooms");
        }

        setClassrooms(data.classrooms || []);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
        setClassrooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Classrooms</h1>
        <CreateClassroomModal triggerClassName="bg-blue-500 text-white hover:bg-blue-600" />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading classrooms...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : classrooms.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            You haven't created any classrooms yet.
          </p>
          <p className="text-gray-500">
            Click the "Create Classroom" button to get started.
          </p>
        </div>
      ) : (
        <ClassroomListCard classrooms={classrooms} />
      )}
    </div>
  );
}
