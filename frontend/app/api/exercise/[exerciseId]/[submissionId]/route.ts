import { NextRequest } from "next/server";
import { fetchFromDjango } from "@/utils/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { exerciseId: string; submissionId: string } }
) {
  try {
    const { exerciseId, submissionId } = params;

    const response = await fetchFromDjango(
      `/exercise/${exerciseId}/submission/${submissionId}/`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return Response.json(
          { error: "Submission not found" },
          { status: 404 }
        );
      }
      throw new Error("Failed to fetch submission");
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error in get submission route:", error);
    return Response.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}
