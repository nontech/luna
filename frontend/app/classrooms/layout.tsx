import React from "react";
import Navbar from "@/app/ui/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classrooms",
  description: "Luna Learning Platform Classrooms",
};

// Split into client component file
import ClientLayout from "./@teacher/components/ClientLayout";

// Server Component
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
      <ClientLayout teacher={teacher} student={student} />
    </div>
  );
}
