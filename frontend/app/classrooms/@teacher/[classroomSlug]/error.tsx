"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto py-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Something went wrong!
        </h2>
        <button
          onClick={() => reset()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
