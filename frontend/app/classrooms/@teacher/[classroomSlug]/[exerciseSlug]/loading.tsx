import { Skeleton } from "@/components/ui/skeleton";

export default function TeacherExerciseLoading() {
  return (
    <div className="p-4">
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div>
              <div className="h-5 w-1/6 bg-gray-200 rounded"></div>
              <div className="mt-2 h-20 bg-gray-200 rounded"></div>
            </div>

            <div>
              <div className="h-5 w-1/6 bg-gray-200 rounded"></div>
              <div className="mt-2 h-20 bg-gray-200 rounded"></div>
            </div>

            <div>
              <div className="h-5 w-1/6 bg-gray-200 rounded"></div>
              <div className="mt-2 h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
