import { NextRequest } from "next/server";
import { fetchFromDjango } from "@/utils/api";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const { exerciseId } = await params;
    const body = await request.json();

    const response = await fetchFromDjango(
      `/exercise/${exerciseId}/submission/create/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { error: errorData.error || "Failed to create submission" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in create submission route:", error);
    return Response.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
