import { NextResponse } from "next/server";

interface CreateClassroomRequest {
  name: string;
  description?: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateClassroomRequest = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Classroom name is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.API_URL}/create_new_classroom`,
      {
        method: "POST",
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

    // First check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to create classroom" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in route handler:", error);
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
