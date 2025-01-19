// utils/api.ts
import { cookies } from "next/headers";

export async function fetchFromDjango(
  endpoint: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken?.value) {
    return new Response(
      JSON.stringify({ error: "Not authenticated" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Cookie: `access_token=${accessToken.value}`,
    ...options.headers,
  };

  const response = await fetch(`${process.env.API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Django API Error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      endpoint: endpoint,
    });
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response;
}
