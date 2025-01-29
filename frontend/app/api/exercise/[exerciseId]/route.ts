import { fetchFromDjango } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
): Promise<Response> {
  try {
    const { exerciseId } = await params;
    console.log(
      "Nextjs Backend API called with exerciseId:",
      exerciseId
    );

    // Log the full URL we're trying to fetch
    const endpoint = `/exercise/${exerciseId}/`;
    console.log("Attempting to fetch from endpoint:", endpoint);

    const response = await fetchFromDjango(endpoint);

    // Log the response status and headers
    console.log("Django Response Status:", response.status);
    console.log(
      "Django Response Headers:",
      Object.fromEntries(response.headers)
    );

    if (!response.ok) {
      // Try to get more details about the error
      const errorText = await response.text();
      console.error("Error response from Django:", errorText);
      throw new Error(`Failed to fetch exercise: ${errorText}`);
    }

    const data = await response.json();
    console.log("Successfully fetched exercise data");
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Detailed error in exercise API route:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown",
      stack: error instanceof Error ? error.stack : "Unknown",
    });

    return NextResponse.json(
      {
        error: "Failed to fetch exercise",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
