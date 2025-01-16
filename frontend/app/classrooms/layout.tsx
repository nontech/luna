"use client";

import React from "react";
import Navbar from "@/app/ui/Navbar";
import { useAuth } from "@/contexts/AuthContext";

function ClassroomLayoutClient({
  teacher,
  student,
}: {
  teacher: React.ReactNode;
  student: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pl-20 pt-10">
      {user?.user_role === "teacher" && teacher}
      {user?.user_role === "student" && student}
      {!user?.user_role && (
        <div>Unauthorized - You are at /classrooms/layout.tsx</div>
      )}
    </div>
  );
}

export default function ClassroomLayout({
  teacher,
  student,
}: {
  teacher: React.ReactNode;
  student: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <ClassroomLayoutClient teacher={teacher} student={student} />
    </div>
  );
}
