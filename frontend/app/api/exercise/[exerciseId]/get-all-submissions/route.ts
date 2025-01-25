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
      throw new Error("Failed to fetch submissions");
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error in get all submissions route:", error);
    return Response.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
