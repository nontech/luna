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
  console.log(
    "[API Request] Headers:",
    options.headers || baseHeaders
  );

  const response = await fetch(`${apiUrl}/${endpoint}`, {
    ...options,
    headers: {
      ...baseHeaders,
      ...(options.headers as HeadersInit),
    },
    credentials: "include", // This is crucial for sending/receiving cookies
    mode: "cors", // Explicitly set CORS mode
  });

  // Log response details
  console.log(`[API Response] Status: ${response.status}`);

  // Log all response headers
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  console.log("[API Response] Headers:", headers);

  // Log if any cookies were set in the response
  const setCookieHeader = response.headers.get("set-cookie");
  if (setCookieHeader) {
    console.log("[API Response] Set-Cookie header present");
  }

  return response;
}
