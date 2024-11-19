export const dynamic = "force-dynamic";

import { Classroom } from "@/types/classroom";
import MoreClassroomActions from "@/app/ui/MoreClassroomActions";

async function getClassroom(slug: string): Promise<Classroom> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/classrooms/${slug}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch classroom");
  }
  return response.json();
}

interface PageProps {
  params: { classroomSlug: string };
}

export default async function ClassroomPage({ params }: PageProps) {
  // Destructure after props to avoid the error
  const { classroomSlug } = await params;
  const classroom = await getClassroom(classroomSlug);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-800">
            {classroom.name}
          </h1>
          <MoreClassroomActions classroom={classroom} />
        </div>

        <p className="mt-4 text-gray-600">{classroom.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Instructor</p>
            <p className="font-medium text-gray-800">
              {classroom.teacher}
            </p>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Created:{" "}
            {new Date(classroom.createdAt).toLocaleDateString()}
          </p>
          <p>
            Last Updated:{" "}
            {new Date(classroom.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
