import { fetchFromDjango } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const response = await fetchFromDjango(
      `/exercise/${params.exerciseId}/tests/`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tests");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const body = await request.json();

    const response = await fetchFromDjango(
      `/exercise/${params.exerciseId}/create_new_test/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create test");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating test:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create test",
      },
      { status: 500 }
    );
  }
}
