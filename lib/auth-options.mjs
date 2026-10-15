import { Pool } from "pg";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Shared with the migration script. Application code imports lib/auth.ts.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  // Allow time for a hosted database to wake after being idle.
  connectionTimeoutMillis: 15000,
});

/** @satisfies {import("better-auth").BetterAuthOptions} */
export const authOptions = {
  appName: "Task Manager",
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: googleClientId && googleClientSecret ? {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      prompt: "select_account",
    },
  } : {},
  // Email verification must be wired before enabling account linking.
  account: { accountLinking: { enabled: false } },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 60,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
    },
  },
};
