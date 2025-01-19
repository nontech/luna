import { fetchFromDjango } from "@/utils/api";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  {
    params,
  }: { params: { classroomSlug: string; exerciseId: string } }
) {
  try {
    const { exerciseId } = params;
    const body = await request.json();

    const response = await fetchFromDjango(
      `/exercise/update/${exerciseId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to update exercise" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating exercise:", error);
    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500 }
    );
  }
}
