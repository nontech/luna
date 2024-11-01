import Navbar from "./ui/Navbar";
import { HomeBreadcrumbs } from "./ui/BreadcrumbsNav";
import ClassroomCard from "./ui/ClassroomListCard";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="pl-20 pt-10">
        <HomeBreadcrumbs />
        <ClassroomCard />
      </div>
    </div>
  );
}
