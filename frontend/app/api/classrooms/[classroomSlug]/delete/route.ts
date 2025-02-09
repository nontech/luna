import { fetchFromDjango } from "@/utils/api";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ classroomSlug: string }> }
) {
  try {
    const { classroomSlug } = await params;
    // Make request to Django backend
    const response = await fetchFromDjango(
      `/delete_classroom/${classroomSlug}/`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
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
        { error: data.error || "Failed to delete classroom" },
        { status: response.status }
      );
    }

    // Return successful response
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in delete route handler:", error);
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
