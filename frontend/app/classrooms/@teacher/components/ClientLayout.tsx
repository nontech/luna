"use client";

import { useAuth } from "@/contexts/AuthContext";
import React from "react";

export default function ClientLayout({
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
