import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookie } from "better-auth/cookies";
import { getAuth } from "@/lib/auth";

// Call inside every protected page, server action, or data access function.
export async function requireSession() {
  const requestHeaders = await headers();
  if (!getSessionCookie(requestHeaders)) redirect("/sign-in");
  const session = await getAuth().api.getSession({ headers: requestHeaders });
  if (!session) redirect("/sign-in");
  return session;
}
