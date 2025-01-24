"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import LandingPage from "./components/LandingPage";
import TeacherHome from "./components/TeacherHome";
import StudentHome from "./components/StudentHome";

export default function Home() {
  const { user, checkAuth, isLoading } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  if (user.user_role === "teacher") {
    return <TeacherHome />;
  }

  return <StudentHome />;
}
