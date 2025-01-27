// utils/api.ts
import { cookies } from "next/headers";

export async function fetchFromDjango(
  endpoint: string,
  options: RequestInit = {}
) {
  const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // In server components, get the cookie from the cookie store
  if (typeof window === "undefined") {
    try {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get("access_token");

      if (!accessToken?.value) {
        throw new Error("Not authenticated");
      }

      return fetch(`${process.env.API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...baseHeaders,
          ...options.headers,
          Cookie: `access_token=${accessToken.value}`,
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Error handling server-side request:", error);
      throw error;
    }
  }

  // Client-side request
  return fetch(`${process.env.API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options.headers,
    },
    credentials: "include",
  });
}
