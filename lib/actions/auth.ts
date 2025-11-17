"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "../constants";



/**
 * Server action to handle user logout
 * Clears authentication cookies and redirects to login
 */
export async function logout() {
  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    // Call backend logout endpoint
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Referer: API_BASE_URL,
        cookie: cookieString,
      },
      credentials: "include",
    });

    // Clear cookies on the client side
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always redirect to login page
    redirect("/auth/login");
  }
}
