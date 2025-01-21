import { fetchFromDjango } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const response = await fetchFromDjango(`/test/${params.testId}/`);

    if (!response.ok) {
      throw new Error("Failed to fetch test details");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching test details:", error);
    return NextResponse.json(
      { error: "Failed to fetch test details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const body = await request.json();

    const response = await fetchFromDjango(
      `/test/update/${params.testId}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update test");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating test:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update test",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const response = await fetchFromDjango(
      `/test/delete/${params.testId}/`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete test");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting test:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete test",
      },
      { status: 500 }
    );
  }
}
