import { NextResponse } from "next/server";
import { fetchFromDjango } from "@/utils/api";

// Export the interface so it can be used by consumers
export interface Classroom {
  id: number;
  name: string;
  description: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export async function GET() {
  try {
    const response = await fetchFromDjango("/classrooms");

    if (response.status === 401) {
      return NextResponse.json(
        { classrooms: [], error: "Not authenticated" },
        { status: 401 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in get-all-classrooms:", error);
    return NextResponse.json(
      {
        classrooms: [],
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch classrooms",
      },
      { status: 500 }
    );
  }
}
