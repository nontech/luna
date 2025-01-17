"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import MoreClassroomActions from "./MoreClassroomActions";
import { Classroom } from "@/types/classroom";

interface ClassroomListCardProps {
  classrooms: Classroom[];
  onClassroomUpdate: () => Promise<void>;
}

export default function ClassroomListCard({
  classrooms,
  onClassroomUpdate,
}: ClassroomListCardProps) {
  return (
    <div className="grid gap-4">
      {classrooms.map((classroom) => (
        <Card key={classroom.id} className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{classroom.name}</CardTitle>
              <CardDescription>
                {classroom.description}
              </CardDescription>
            </div>
            <MoreClassroomActions
              classroom={classroom}
              onClassroomUpdate={onClassroomUpdate}
            />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Created:{" "}
                {new Date(classroom.createdAt).toLocaleDateString()}
              </span>
              <Link
                href={`/classrooms/${classroom.slug}`}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Enter Classroom →
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
