import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <div className="space-x-4">
          <Skeleton className="h-9 w-32 inline-block" />
          <Skeleton className="h-9 w-32 inline-block" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="border rounded-lg p-4">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
