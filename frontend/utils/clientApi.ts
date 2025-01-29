// utils/clientApi.ts

const baseHeaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function fetchFromDjangoClient(
  endpoint: string,
  options: RequestInit = {}
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log(
    `[API Request] ${options.method || "GET"} ${apiUrl}/${endpoint}`
  );

  const response = await fetch(`${apiUrl}/${endpoint}`, {
    ...options,
    headers: {
      ...baseHeaders,
      ...(options.headers as HeadersInit),
    },
    credentials: "include", // This is crucial for sending/receiving cookies
  });

  // Log response details
  console.log(`[API Response] Status: ${response.status}`);

  return response;
}
