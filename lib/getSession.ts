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
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Accept: "application/json",
        Referer: API_BASE_URL,
        cookie: cookieString,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      // Log in production to help debug session issues
      if (process.env.NODE_ENV === 'production') {
        console.log(`[getSession] Failed to fetch session: ${response.status} ${response.statusText}`);
      }
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    // Log errors in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[getSession] Error fetching session:', error);
    }
    return null;
  }
};