import { HomeBreadcrumbs } from "./ui/BreadcrumbsNav";
import ClassroomListCard from "./ui/ClassroomListCard";

export default function Home() {
  return (
    <div className="pl-20 pt-10">
      <HomeBreadcrumbs />
      <ClassroomListCard />
    </div>
  );
}
