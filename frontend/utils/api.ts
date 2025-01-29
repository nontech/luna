// utils/api.ts
import { cookies } from "next/headers";

const baseHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function fetchFromDjango(
  endpoint: string,
  options: RequestInit = {}
) {
  // Get cookies from the server-side cookie store
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  // Construct the URL
  const url = `${process.env.API_URL}/${endpoint}`;

  // Make the request to Django with cookies
  const response = await fetch(url, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options.headers,
      Cookie: accessToken ? `access_token=${accessToken.value}` : "",
    },
    credentials: "include",
  });

  return response;
}
