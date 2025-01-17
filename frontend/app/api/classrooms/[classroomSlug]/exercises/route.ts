import { fetchFromDjango } from "@/utils/api";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { classroomSlug: string } }
) {
  try {
    const { classroomSlug } = await params;
    const response = await fetchFromDjango(
      `/classroom/${classroomSlug}/exercises/`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exercises");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
