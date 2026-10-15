import { existsSync } from "node:fs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (existsSync(".env")) process.loadEnvFile(".env");
if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) {
  console.error("Set DATABASE_URL and BETTER_AUTH_SECRET in .env before migrating.");
  process.exit(1);
}

const { getMigrations } = await import("better-auth/db/migration");
const { authOptions, pool } = await import("../lib/auth-options.mjs");

try {
  const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(authOptions);
  console.log(`Auth schema: ${toBeCreated.length} table(s) to create, ${toBeAdded.length} table(s) to update.`);
  if (process.argv.includes("--apply")) {
    await runMigrations();
    console.log("Auth database migration complete.");
  } else {
    console.log("Preview only. Run pnpm auth:migrate to apply.");
  }
} catch {
  console.error("Auth migration failed. Check the database URL, database availability, and schema permissions.");
  process.exitCode = 1;
} finally {
  await pool.end();
}
