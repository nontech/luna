"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchFromDjangoClient } from "@/utils/clientApi";

interface ClassroomData {
  name: string;
  slug: string;
}

interface ExerciseData {
  name: string;
  slug: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [classroom, setClassroom] = useState<ClassroomData | null>(
    null
  );
  const [exercise, setExercise] = useState<ExerciseData | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!pathname) return;

      const segments = pathname.split("/").filter(Boolean);

      // If we're in a classroom route
      if (segments[0] === "classrooms" && segments[1]) {
        try {
          const response = await fetchFromDjangoClient(
            `api/classrooms/${segments[1]}/`
          );
          if (response.ok) {
            const data = await response.json();
            setClassroom({ name: data.name, slug: data.slug });

            // If we're in an exercise route
            if (segments[2]) {
              const exerciseId = searchParams.get("id");
              if (exerciseId) {
                const exerciseResponse = await fetchFromDjangoClient(
                  `api/exercises/${exerciseId}/`
                );
                if (exerciseResponse.ok) {
                  const exerciseData = await exerciseResponse.json();
                  setExercise({
                    name: exerciseData.name,
                    slug: exerciseData.slug,
                  });
                }
              }
            } else {
              setExercise(null);
            }
          }
        } catch (error) {
          console.error("Error fetching breadcrumb data:", error);
        }
      }
    }

    fetchData();
  }, [pathname, searchParams]);

  // Define fixed breadcrumb items
  const breadcrumbItems = [{ label: "Home", href: "/" }];

  // Add Classrooms link if we're in the classrooms section
  if (pathname?.includes("/classrooms")) {
    breadcrumbItems.push({
      label: "Classrooms",
      href: "/classrooms",
    });
  }

  // Add classroom if available
  if (classroom && pathname?.includes("/classrooms/")) {
    breadcrumbItems.push({
      label: classroom.name,
      href: `/classrooms/${classroom.slug}`,
    });
  }

  // Add exercise if available
  if (exercise && classroom && pathname?.includes("/classrooms/")) {
    const exerciseId = searchParams.get("id");
    breadcrumbItems.push({
      label: exercise.name,
      href: `/classrooms/${classroom.slug}/${exercise.slug}?id=${exerciseId}`,
    });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
          <Link
            href={item.href}
            className={`hover:text-blue-600 transition-colors ${
              index === breadcrumbItems.length - 1
                ? "font-semibold text-gray-900"
                : ""
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
