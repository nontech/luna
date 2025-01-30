"use client";

import { useAuth } from "@/contexts/AuthContext";
import UnauthorizedMessage from "./UnauthorizedMessage";
import React from "react";

export default function ClientLayout({
  teacher,
  student,
}: {
  teacher: React.ReactNode;
  student: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="pl-20 pt-10">
      {user?.user_role === "teacher" && teacher}
      {user?.user_role === "student" && student}
      {!user?.user_role && <UnauthorizedMessage />}
    </div>
  );
}
