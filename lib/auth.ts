import "server-only";
import { betterAuth } from "better-auth";
import { authOptions } from "./auth-options.mjs";

let instance: ReturnType<typeof betterAuth<typeof authOptions>> | undefined;

export function authConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET && process.env.BETTER_AUTH_URL);
}

export function getAuth() {
  if (!authConfigured()) throw new Error("Authentication requires DATABASE_URL, BETTER_AUTH_SECRET, and BETTER_AUTH_URL.");
  return instance ??= betterAuth(authOptions);
}
