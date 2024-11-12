import Link from "next/link";
import Breadcrumbs from "../ui/BreadcrumbsNav";

export default function ClassroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100">
      <Breadcrumbs />
      {children}
    </div>
  );
}
