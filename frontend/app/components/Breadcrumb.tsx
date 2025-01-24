"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname
    .split("/")
    .filter((segment) => segment !== "")
    .map((segment) => {
      // Convert slug to display text
      return segment.replace(/-/g, " ");
    });

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      return {
        label: segment,
        href,
      };
    }),
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
          <Link
            href={item.href}
            className={`hover:text-blue-600 transition-colors ${
              index === breadcrumbItems.length - 1
                ? "font-semibold text-gray-900"
                : ""
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
