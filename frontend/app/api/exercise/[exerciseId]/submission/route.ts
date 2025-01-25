import { NextRequest } from "next/server";
import { fetchFromDjango } from "@/utils/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const { exerciseId } = params;

    const response = await fetchFromDjango(
      `/exercise/${exerciseId}/submission/`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    // If no submission exists, return null (this is a valid state)
    if (response.status === 404) {
      return Response.json(null, { status: 200 });
    }

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { error: errorData.error || "Failed to fetch submission" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error in submission GET route:", error);
    return Response.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}
