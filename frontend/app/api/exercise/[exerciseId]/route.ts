import { fetchFromDjango } from "@/utils/api";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const exerciseId = params.exerciseId;
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
  } catch (error: any) {
    console.error("Detailed error in exercise API route:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: "Failed to fetch exercise", details: error.message },
      { status: 500 }
    );
  }
}
