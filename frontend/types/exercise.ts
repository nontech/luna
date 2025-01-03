export interface Exercise {
  id: string;
  name: string;
  slug: string;
  instructions: string;
  output_instructions: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface ExerciseListResponse {
  exercises: Exercise[];
}
