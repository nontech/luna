import { fetchFromDjango } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classroomSlug: string }> }
) {
  try {
    const { classroomSlug } = await params;
    const response = await fetchFromDjango(
      `/classroom/${classroomSlug}/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error response:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch classroom" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching classroom:", error);
    return NextResponse.json(
      { error: "Failed to fetch classroom" },
      { status: 500 }
    );
  }
}
