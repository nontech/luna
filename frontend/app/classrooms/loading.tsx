import Navbar from "@/app/components/Navbar";

export default function ClassroomsLoading() {
  return (
    <div>
      <Navbar />
      <div className="pl-20 pt-6">
        {/* Breadcrumb skeleton */}
        <div className="h-8 mb-4 w-64 bg-gray-200 animate-pulse rounded" />

        {/* Content skeleton */}
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
