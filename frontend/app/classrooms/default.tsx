"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Default() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      if (user.user_role === "teacher") {
        router.replace("/classrooms/@teacher");
      } else if (user.user_role === "student") {
        router.replace("/classrooms/@student");
      }
    }
  }, [user, isLoading, router]);

  // Return null or a loading state
  return null;
}
