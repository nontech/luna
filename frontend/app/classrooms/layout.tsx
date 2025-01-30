import React, { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import type { Metadata } from "next";
import Breadcrumb from "@/app/components/Breadcrumb";
import ClientLayout from "./components/ClientLayout";

export const metadata: Metadata = {
  title: "Classrooms",
  description: "Luna Learning Platform Classrooms",
};

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
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumb />
        </Suspense>
        <ClientLayout teacher={teacher} student={student} />
      </div>
    </div>
  );
}
