import { fetchFromDjango } from "@/utils/api";
import { NextResponse } from "next/server";

interface UpdateClassroomRequest {
  name: string;
  description?: string;
}

export async function PUT(
  request: Request,
  { params }: { params: { classroomSlug: string } }
) {
  try {
    const body: UpdateClassroomRequest = await request.json();

    // Validate request body
    if (!body.name) {
      return NextResponse.json(
        { error: "Classroom name is required" },
        { status: 400 }
      );
    }
    const classroomSlug = await params.classroomSlug;

    // Make request to Django backend
    const response = await fetchFromDjango(
      `/update_classroom/${classroomSlug}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: body.name,
          description: body.description || "",
        }),
      }
    );

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();

    // Handle non-200 responses
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to update classroom" },
        { status: response.status }
      );
    }

    // Return successful response
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in update route handler:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}
