import { ClassroomContent } from "./components/ClassroomContent";

interface Props {
  params: { classroomSlug: string };
}

export default async function StudentClassroomPage({
  params,
}: Props) {
  const { classroomSlug } = await params;
  return <ClassroomContent classroomSlug={classroomSlug} />;
}
