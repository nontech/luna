import Link from "next/link";

interface Classroom {
  id: number;
  name: string;
  description: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export default async function ClassroomsPage() {
  const response = await fetch(
    "http://localhost:3000/api/classrooms/get-all-classrooms"
  );
  const data = await response.json();

  // If route handler returned an error
  if (data.error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">{data.error}</div>
      </div>
    );
  }

  // If no classrooms found
  if (!data.classrooms || data.classrooms.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No classrooms available.</div>
      </div>
    );
  }

  // Success case
  return (
    <div className="grid gap-4 p-4">
      {data.classrooms.map((classroom: Classroom) => (
        <div key={classroom.id} className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold">{classroom.name}</h2>
          <p className="text-gray-600">{classroom.description}</p>
          <div className="mt-2">
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {classroom.teacher}
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Created:{" "}
            {new Date(classroom.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
