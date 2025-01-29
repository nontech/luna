"use client"; // Error boundaries must be Client Components

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600">
              Something went wrong!
            </h1>
            <p className="mt-2 text-gray-600">{error.message}</p>
          </div>
        </div>
      </body>
    </html>
  );
}
