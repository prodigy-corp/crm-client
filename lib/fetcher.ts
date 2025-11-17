import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "./constants";



interface FetcherOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Server-side fetcher utility with automatic authentication.
 * ⚠️ Do not use this in client components - accessing `cookies()`
 * on the client will throw an error
 * 
 * @param url - API endpoint path (e.g., "/users/me")
 * @param options - Fetch options with additional requireAuth flag
 * @returns JSON response from the API
 * 
 * @example
 * const data = await fetcher("/users/me");
 * const data = await fetcher("/posts", { method: "POST", body: JSON.stringify(data) });
 */
export const fetcher = async <T = any>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> => {
  const { requireAuth = true, ...fetchOptions } = options;

  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Referer: API_BASE_URL,
        cookie: cookieString,
        ...fetchOptions.headers,
      },
      cache: "no-store",
      credentials: "include",
      ...fetchOptions,
    });

    // Handle authentication errors
    if (response.status === 401 && requireAuth) {
      redirect("/auth/login");
    }

    // Handle forbidden errors
    if (response.status === 403) {
      throw new Error("Access forbidden");
    }

    // Handle not found errors
    if (response.status === 404) {
      throw new Error("Resource not found");
    }

    // Handle server errors
    if (response.status >= 500) {
      throw new Error("Server error occurred");
    }

    // Parse response
    const data = await response.json();

    // Handle API-level errors
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("Fetcher error:", error);
    throw error;
  }
};