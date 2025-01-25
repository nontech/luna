import { NextRequest } from "next/server";
import { fetchFromDjango } from "@/utils/api";

export async function POST(
  request: NextRequest,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const { exerciseId } = params;
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
      throw new Error("Failed to create submission");
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
