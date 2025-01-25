import { NextRequest } from "next/server";
import { fetchFromDjango } from "@/utils/api";

export async function PUT(
  request: NextRequest,
  { params }: { params: { exerciseId: string; submissionId: string } }
) {
  try {
    const { exerciseId, submissionId } = params;
    const body = await request.json();

    const response = await fetchFromDjango(
      `/exercise/${exerciseId}/submission/${submissionId}/update/`,
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
      if (response.status === 404) {
        return Response.json(
          { error: "Submission not found" },
          { status: 404 }
        );
      }
      if (response.status === 403) {
        return Response.json(
          { error: "Not authorized to update this submission" },
          { status: 403 }
        );
      }
      throw new Error("Failed to update submission");
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
