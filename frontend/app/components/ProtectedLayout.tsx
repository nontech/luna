"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  requireTeacher?: boolean;
}

export default function ProtectedLayout({
  children,
  requireTeacher = false,
}: ProtectedLayoutProps) {
  const { user, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.replace("/");
      }
    };

    verifyAuth();
  }, [checkAuth, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-8">
          Verifying authentication...
        </div>
      </div>
    );
  }

  // Check for teacher role if required
  if (requireTeacher && (!user || user.user_role !== "teacher")) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-8">
          You need to be logged in as a teacher to view this content.
        </div>
      </div>
    );
  }

  // If not authenticated at all
  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-8">
          Please log in to view this content.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
