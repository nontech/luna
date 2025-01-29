// utils/api.ts
import { cookies } from "next/headers";

const baseHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  // Add Origin header to simulate request from frontend
  Origin:
    process.env.FRONTEND_URL ||
    "https://luna-frontend-blush.vercel.app",
};

export async function fetchFromDjango(
  endpoint: string,
  options: RequestInit = {}
) {
  try {
    // Get cookies from the server-side cookie store
    const cookieStore = await cookies();

    // Get all cookies and format them
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Remove trailing slash if present, but keep the leading slash
    const normalizedEndpoint = endpoint.endsWith("/")
      ? endpoint.slice(0, -1)
      : endpoint;

    // Construct the URL - remove trailing slash from API_URL if present
    const baseUrl = process.env.API_URL?.endsWith("/")
      ? process.env.API_URL.slice(0, -1)
      : process.env.API_URL;
    const url = `${baseUrl}${normalizedEndpoint}`;

    console.log("[API Request URL]:", url);
    console.log("[API Request Cookies]:", cookieHeader);
    console.log("[API Request Origin]:", baseHeaders.Origin);

    // Make the request to Django with cookies
    const response = await fetch(url, {
      ...options,
      headers: {
        ...baseHeaders,
        ...options.headers,
        Cookie: cookieHeader, // Forward all cookies
      },
      credentials: "include",
    });

    // Log response status and headers for debugging
    console.log("[API Response Status]:", response.status);
    console.log(
      "[API Response Headers]:",
      Object.fromEntries(response.headers)
    );

    // Handle 401 Unauthorized
    if (response.status === 401) {
      throw new Error("Not authenticated");
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("[API Error] Non-JSON response:", text);
      throw new Error("Invalid response format from server");
    }

    // If response is not ok but is JSON, parse the error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Request failed");
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API Error]:", error);
    throw error;
  }
}
