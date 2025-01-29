"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import ClassroomCreator from "./CreateClassroomModal";

// Update interface to match backend response
interface Classroom {
  id: number;
  name: string;
  description: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export default function ClassroomsCard() {
  const pathname = usePathname();
  const [classrooms, setClassrooms] = React.useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch(
        "/api/classrooms/get-all-classrooms"
      );
      const data = await response.json();

      // If the route handler returned an error, use that message
      if (data.error) {
        setError(data.error);
      } else {
        setClassrooms(data.classrooms);
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClassrooms();
  }, []);

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">Classrooms</CardTitle>
        <CardDescription>
          View all available classrooms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            Loading classrooms...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : classrooms.length === 0 ? (
          <div className="text-center py-4">
            No classrooms available.
          </div>
        ) : (
          <ul className="space-y-4">
            {classrooms.map((classroom) => (
              <li
                key={classroom.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <Link
                    href={`/classrooms/${classroom.slug}`}
                    className={clsx(
                      "text-gray-600 hover:text-blue-600 hover:underline",
                      {
                        "text-blue-600 underline":
                          pathname ===
                          `/classrooms/${classroom.slug}`,
                      }
                    )}
                  >
                    <h3 className="font-semibold">
                      {classroom.name}
                    </h3>
                    {classroom.description && (
                      <p className="text-sm text-gray-500">
                        {classroom.description}
                      </p>
                    )}
                  </Link>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {classroom.teacher}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(
                      classroom.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <ClassroomCreator />
      </CardFooter>
    </Card>
  );
}
