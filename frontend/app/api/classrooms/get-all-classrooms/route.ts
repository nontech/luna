import { NextResponse } from "next/server";

// Define the interface for classroom data
interface Classroom {
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
    // Fetch classrooms from Django backend
    const response = await fetch(
      `${process.env.API_URL}/classrooms`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Add cache options if needed
        // next: { revalidate: 60 }, // revalidate every 60 seconds
      }
    );

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch classrooms",
      },
      { status: 500 }
    );
  }
}
