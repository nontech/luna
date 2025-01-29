import { fetchFromDjango } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ classroomSlug: string }> }
) {
  try {
    const { classroomSlug } = await params;

    const response = await fetchFromDjango(
      `/classroom/${classroomSlug}/leave/`,
      {
        method: "DELETE",
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
    console.error("Error leaving classroom:", error);
    return NextResponse.json(
      { error: "Failed to leave classroom" },
      { status: 500 }
    );
  }
}
