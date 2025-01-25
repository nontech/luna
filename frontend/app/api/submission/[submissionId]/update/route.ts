import { NextRequest } from "next/server";
import { fetchFromDjango } from "@/utils/api";

export async function PUT(
  request: NextRequest,
  { params }: { params: { exerciseId: string; submissionId: string } }
) {
  try {
    const { submissionId } = params;
    const body = await request.json();

    const response = await fetchFromDjango(
      `/submission/${submissionId}/update/`,
      {
        method: "PUT",
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
        { error: errorData.error || "Failed to update submission" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error in update submission route:", error);
    return Response.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
