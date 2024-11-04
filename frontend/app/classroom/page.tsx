import Link from "next/link";
import { Suspense } from "react";
import Loading from "./loading";

// Mock classroom data
const classroomsData = [
  {
    id: "1",
    slug: "math-101",
    title: "Math 101: Introduction to Algebra",
    description:
      "Learn fundamental algebraic concepts, equations, and problem-solving techniques.",
    teacher: "Mr. Smith",
    studentCount: 25,
  },
  // ... other classroom data
];

// Simulate async data fetching
async function getClassrooms() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return classroomsData;
}

// Async component to fetch and display classrooms
async function ClassroomList() {
  const classrooms = await getClassrooms();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {classrooms.map((classroom) => (
        <Link
          href={`/classroom/${classroom.slug}`}
          key={classroom.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-bold">{classroom.title}</h2>
          <p className="text-gray-600 mt-2">{classroom.description}</p>
          <div className="mt-4 text-sm">
            <p>Teacher: {classroom.teacher}</p>
            <p>Students: {classroom.studentCount}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Page component
export default function ClassroomPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ClassroomList />
    </Suspense>
  );
}
