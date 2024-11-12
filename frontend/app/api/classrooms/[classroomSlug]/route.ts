import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ classroomSlug: string }> }
) {
  try {
    const slug = (await params).classroomSlug;
    const response = await fetch(
      `http://localhost:8000/classroom/${slug}/`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch classroom");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch classroom" },
      { status: 500 }
    );
  }
}
