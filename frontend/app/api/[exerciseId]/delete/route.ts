import { NextResponse } from "next/server";   

export async function DELETE(
  request: Request,
  {
    params,
    }: { params: { classroomSlug: string; exerciseId: string } }
  ) {
    try {
      const { exerciseId } = params;
      const response = await fetch(
        `${process.env.API_URL}/exercise/delete/${exerciseId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete exercise");
      }
  
      return NextResponse.json({
        message: "Exercise deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting exercise:", error);
      return NextResponse.json(
        { error: "Failed to delete exercise" },
        { status: 500 }
      );
    }
  }