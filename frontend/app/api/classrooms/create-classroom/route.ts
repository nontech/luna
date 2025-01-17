import { NextResponse } from "next/server";
import { fetchFromDjango } from "@/utils/api";

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

    const response = await fetchFromDjango("/create_new_classroom", {
      method: "POST",
      body: JSON.stringify({
        name: body.name,
        description: body.description || "",
      }),
    });

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
