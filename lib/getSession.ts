import { cookies } from "next/headers";
import { API_BASE_URL } from "./constants";

/**
 * Server-only session fetcher.
 * ⚠️ Do not use this in client components - accessing `cookies()`
 * on the client will throw an error
 * @returns The user session data, or null if unauthenticated.
 */
export const getSession = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Accept: "application/json",
      Referer: API_BASE_URL,
      cookie: (await cookies()).toString(),
    },
    cache: "no-store",
  });

  

  if (!response.ok) return null;

  return (await response.json()).data;
};