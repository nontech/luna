"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Exercise } from "@/types/exercise";

interface Classroom {
  id: number;
  name: string;
  description: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  is_member: boolean;
}

interface ClassroomContentProps {
  classroomSlug: string;
}

export function ClassroomContent({
  classroomSlug,
}: ClassroomContentProps) {
  const { toast } = useToast();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchClassroom = React.useCallback(async () => {
    try {
      const response = await fetch(
        `/api/classrooms/${classroomSlug}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch classroom details");
      }

      const data = await response.json();
      setClassroom(data);
    } catch (error) {
      console.error("Error fetching classroom:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load classroom details",
      });
    } finally {
      setIsLoading(false);
    }
  }, [classroomSlug, toast]);

  const fetchExercises = React.useCallback(async () => {
    try {
      const response = await fetch(
        `/api/classrooms/${classroomSlug}/exercises`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }

      const data = await response.json();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setExercises([]);
    }
  }, [classroomSlug]);

  useEffect(() => {
    fetchClassroom();
    fetchExercises();
  }, [fetchClassroom, fetchExercises]);

  const handleJoinClassroom = async () => {
    try {
      setIsActionLoading(true);
      const response = await fetch(
        `/api/classrooms/${classroomSlug}/join`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to join classroom",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Successfully joined classroom",
      });

      // Refresh the classroom data
      await fetchClassroom();
    } catch (error) {
      console.error("Error joining classroom:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join classroom",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLeaveClassroom = async () => {
    try {
      setIsActionLoading(true);
      const response = await fetch(
        `/api/classrooms/${classroomSlug}/leave`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to leave classroom",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Successfully left classroom",
      });

      // Refresh the classroom data
      await fetchClassroom();
    } catch (error) {
      console.error("Error leaving classroom:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to leave classroom",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading || !classroom) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="space-y-8">
        {/* Classroom Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Classroom: {classroom.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Teacher: {classroom.teacher}
            </p>
            <p className="text-gray-600">
              {classroom.description || "No description available."}
            </p>
          </div>
          {classroom.is_member && (
            <Button
              onClick={handleLeaveClassroom}
              variant="secondary"
              disabled={isActionLoading}
            >
              {isActionLoading ? "Loading..." : "Leave Classroom"}
            </Button>
          )}
        </div>

        {/* Join Message or Exercise List */}
        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Join Message */}
            {!classroom.is_member ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  Join this classroom to view and participate in
                  exercises.
                </p>
                <Button
                  onClick={handleJoinClassroom}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? "Loading..." : "Join Classroom"}
                </Button>
              </div>
            ) : // After joining, show exercises
            // If no exercises, show a message
            exercises.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600">
                  No exercises available yet.
                </p>
              </div>
            ) : (
              // If there are exercises, show them
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <CardHeader>
                      <CardTitle>{exercise.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {exercise.instructions ||
                          "No instructions available..."}
                      </p>
                      <div className="flex justify-end">
                        {classroom.is_member ? (
                          <Link
                            href={`/classrooms/${classroomSlug}/${exercise.slug}?id=${exercise.id}`}
                            className="text-primary hover:underline inline-flex items-center"
                          >
                            Enter Exercise
                            <svg
                              className="ml-1 w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </Link>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  );
}
