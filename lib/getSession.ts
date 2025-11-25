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

    console.log('[getSession] Fetching session from:', `${API_BASE_URL}/auth/me`);
    console.log('[getSession] Cookies:', cookieString ? 'Present' : 'None');

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Accept: "application/json",
        Referer: API_BASE_URL,
        cookie: cookieString,
      },
      credentials: "include",
      cache: "no-store",
    });

    console.log('[getSession] Response status:', response.status, response.statusText);

    if (!response.ok) {
      console.log(`[getSession] Failed to fetch session: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log('[getSession] Session data:', data.data ? 'User found' : 'No user');
    return data.data;
  } catch (error) {
    console.error('[getSession] Error fetching session:', error);
    return null;
  }
};