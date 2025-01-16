// utils/api.ts
import { cookies } from "next/headers";

export async function fetchFromDjango(
  endpoint: string,
  options: RequestInit = {}
) {
  const cookieStore = await cookies();
  console.log("Cookie Store:", cookieStore);
  const accessToken = cookieStore.get("access_token");
  console.log("Access Token:", accessToken);
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
    if (response.status === 401) {
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
