import { cookies } from "next/headers";
import { User } from "./dataTypes";
import { API_BASE_URL } from "./constants";



export interface SessionUser extends Omit<User, 'id'> {
  id: string;
  avatar?: string;
  status: string;
  isEmailVerified: boolean;
  isSellerVerified: boolean;
  stripeOnboardingComplete: boolean;
  isTwoFactorEnabled: boolean;
  roles: string[];
  permissions: string[];
}

/**
 * Server-only session fetcher.
 * ⚠️ Do not use this in client components - accessing `cookies()`
 * on the client will throw an error
 * @returns The user session data, or null if unauthenticated.
 */
export const getSession = async (): Promise<SessionUser | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Accept: "application/json",
         Referer: API_BASE_URL,
      cookie: (await cookies()).toString(),
      },
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
};