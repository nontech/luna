import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params,
  }: { params: { classroomSlug: string; exerciseId: string } }
) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/exercise/${params.exerciseId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exercise");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exercise" },
      { status: 500 }
    );
  }
}
