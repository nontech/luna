"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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

interface Classroom {
  id: number;
  name: string;
  description: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

interface ClassroomListCardProps {
  classrooms: Classroom[];
}

export default function ClassroomListCard({
  classrooms,
}: ClassroomListCardProps) {
  const pathname = usePathname();

  return (
    <div className="grid gap-4">
      {classrooms.map((classroom) => (
        <Card key={classroom.id} className="w-full">
          <CardHeader>
            <CardTitle>{classroom.name}</CardTitle>
            <CardDescription>{classroom.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Created:{" "}
                {new Date(classroom.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/classrooms/${classroom.slug}`}
                  className="text-blue-500 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/classrooms/${classroom.slug}/edit`}
                  className="text-green-500 hover:underline"
                >
                  Edit
                </Link>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => {
                    /* Add delete handler */
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
