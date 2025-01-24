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
import { GraduationCap } from "lucide-react";

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
                {classroom.description || "Yet to add description..."}
              </CardDescription>
            </div>
            <MoreClassroomActions
              classroom={classroom}
              onClassroomUpdate={onClassroomUpdate}
            />
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
  );
}
