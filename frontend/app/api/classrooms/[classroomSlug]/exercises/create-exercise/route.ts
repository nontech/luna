import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { classroomSlug: string } }
) {
  try {
    const { classroomSlug } = params;
    const body = await request.json();

    const response = await fetch(
      `${process.env.API_URL}/classroom/${classroomSlug}/create_new_exercise/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to create exercise" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Failed to create exercise" },
      { status: 500 }
    );
  }
}
