"use client";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface Classroom {
  id: number;
  name: string;
  description: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  is_member: boolean;
}

export default function StudentClassroomPage() {
  const [classrooms, setClassrooms] = React.useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setIsLoading(true);
        const response = await fetchFromDjangoClient("classrooms");

        if (!response.ok) {
          throw new Error("Failed to fetch classrooms");
        }

        const data = await response.json();
        setClassrooms(data.classrooms || []);
        setErrorMessage(null);
      } catch (err) {
        // Use the error in a meaningful way
        setErrorMessage(
          err instanceof Error ? err.message : "An error occurred"
        );
        setClassrooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Classrooms</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classrooms?.map((classroom: Classroom) => (
          <Card
            key={classroom.id}
            className="w-full hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="space-y-2">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {classroom.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 pt-1">
                  {classroom.description ||
                    "Yet to add description..."}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="font-medium">
                    Teacher: {classroom.teacher}
                  </span>
                </div>
                <Link
                  href={`/classrooms/${classroom.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Enter Classroom
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
        ))}
      </div>
    </div>
  );
}
