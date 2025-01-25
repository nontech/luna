"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-bold text-red-600">
        Something went wrong!
      </h2>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
