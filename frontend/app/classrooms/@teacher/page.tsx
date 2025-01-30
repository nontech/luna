"use client";

import React from "react";
import ClassroomListCard from "./components/ClassroomListCard";
import CreateClassroomModal from "./components/CreateClassroomModal";
import { Classroom } from "@/types/classroom";
import { fetchFromDjangoClient } from "@/utils/clientApi";

export default function TeacherClassroomPage() {
  const [classrooms, setClassrooms] = React.useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchClassrooms = React.useCallback(async () => {
    try {
      const response = await fetchFromDjangoClient(`api/classrooms/`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch classrooms");
      }
      console.log("[Auth] Successfully authenticated");
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
  }, []);

  // Fetch classrooms on mount
  React.useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

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
            You haven&apos;t created any classrooms yet.
          </p>
          <p className="text-gray-500">
            Click &quot;Create Classroom&quot; to get started!
          </p>
        </div>
      ) : (
        <ClassroomListCard
          classrooms={classrooms}
          onClassroomUpdate={fetchClassrooms}
        />
      )}
    </div>
  );
}
