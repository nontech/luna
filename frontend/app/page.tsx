"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import ClassroomListCard from "./ui/ClassroomListCard";
import LandingPage from "./components/LandingPage";
import Navbar from "./ui/Navbar";

export default function Home() {
  const { user, checkAuth, isLoading } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
    };
    verifyAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div>
      <Navbar />
      <div className="pl-20 pt-10">
        <ClassroomListCard />
      </div>
    </div>
  );
}
