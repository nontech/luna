import React from "react";
import Navbar from "@/app/ui/Navbar";
import type { Metadata } from "next";
import Breadcrumb from "@/app/components/Breadcrumb";

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
      <div className="pl-20 pt-6">
        <Breadcrumb />
        <ClientLayout teacher={teacher} student={student} />
      </div>
    </div>
  );
}
