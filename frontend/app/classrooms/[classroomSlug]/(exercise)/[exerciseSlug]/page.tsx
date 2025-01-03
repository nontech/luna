interface Props {
  params: {
    classroomSlug: string;
    exerciseSlug: string;
  };
  searchParams: {
    id: string;
  };
}

async function getExerciseDetails(exerciseId: string) {
  const response = await fetch(
    `${process.env.APP_URL}/api/${exerciseId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exercise");
  }

  return response.json();
}

export default async function ExercisePage({
  params,
  searchParams,
}: Props) {
  const { id: exerciseId } = await searchParams;

  if (!exerciseId) {
    throw new Error("Exercise ID is required");
  }

  const exercise = await getExerciseDetails(exerciseId);

  return (
    <div>
      <h1>{exercise.name}</h1>
      {/* Rest of your exercise page content */}
      <div>You are in the individual exercise page</div>
    </div>
  );
}
