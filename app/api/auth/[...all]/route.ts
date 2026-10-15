import { toNextJsHandler } from "better-auth/next-js";
import { authConfigured, getAuth } from "@/lib/auth";

async function handle(request: Request) {
  if (!authConfigured()) {
    return Response.json({ message: "Sign-in is not available yet. The database setup must be completed." }, { status: 503 });
  }
  return getAuth().handler(request);
}

export const { GET, POST } = toNextJsHandler(handle);
