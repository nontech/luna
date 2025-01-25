import { fetchFromDjango } from "@/utils/api";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { classroomSlug: string } }
) {
  try {
    const response = await fetchFromDjango(
      `/classroom/${params.classroomSlug}/join/`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error joining classroom:", error);
    return NextResponse.json(
      { error: "Failed to join classroom" },
      { status: 500 }
    );
  }
}
