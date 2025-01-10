"use client";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import ClassroomListCard from "./ui/ClassroomListCard";
import LandingPage from "./components/LandingPage";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="pl-20 pt-10">
      <ClassroomListCard />
    </div>
  );
}
