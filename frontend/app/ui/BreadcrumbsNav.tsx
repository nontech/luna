"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          // Capitalize and format segment name
          const formattedName =
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <li key={path}>
              {isLast ? (
                formattedName
              ) : (
                <Link href={path}>{formattedName}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
