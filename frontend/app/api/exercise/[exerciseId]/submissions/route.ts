import { NextRequest } from "next/server";
import { fetchFromDjango } from "@/utils/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const { exerciseId } = params;

    const response = await fetchFromDjango(
      `/exercise/${exerciseId}/submissions/`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to fetch submissions"
      );
    }

    const data = await response.json();
    console.log("Django response:", data); // Debug log
    return Response.json(data);
  } catch (error) {
    console.error("Error in get submissions route:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch submissions",
      },
      { status: 500 }
    );
  }
}
