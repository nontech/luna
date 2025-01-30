"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Default() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.user_role === "teacher") {
        router.replace("/classrooms/@teacher");
      } else if (user.user_role === "student") {
        router.replace("/classrooms/@student");
      }
    }
  }, [user, router]);

  return null;
}
