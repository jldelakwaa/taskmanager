# Task Manager

Next.js application with a Coliconstruct task workspace, Better Auth, email/password authentication, optional Google sign-in, and PostgreSQL sessions.

## Public home page and workspace preview

Run `pnpm dev` and open http://localhost:3000. The public product page introduces the task manager with the company logo, white and blue theme, interactive product views, feature explanations, workflow, FAQs, and links to the preview and team sign-in. It works before database setup. Public account access and launch details are presented as upcoming; there are no fabricated customer claims, pricing, or contact forms.

The full interactive workspace is available at http://localhost:3000/preview. The authenticated workspace remains at `/dashboard`.

The public page has a blue-tinted sticky navigation bar that keeps its color while shrinking after scrolling, plus a moon/sun theme toggle. The selected light or dark theme is remembered in browser local storage. Theme colors are scoped to the public page.

The preview includes board, table, and monthly calendar views; task creation and editing; status changes by dropdown or drag; search and filters; and a daily report of tasks scheduled per user. Sample tasks and team members are illustrative. Edits are saved only in browser local storage and are separate from authenticated company records. Daily reports show the current status of scheduled tasks; historical activity reporting will require the database workflow.

## Workspace and administration prototype

The workspace has real page routes and a shared sidebar:

| Route | Page |
| --- | --- |
| `/dashboard` | Task summary, board, daily agenda, and team progress |
| `/tasks` | Task board and table, search, filters, creation, and editing |
| `/calendar` | Monthly calendar and date links to reports |
| `/reports` | Tasks scheduled per date and team member |
| `/team` | Searchable sample directory with task counts |
| `/settings` | Shared light/dark appearance preferences |
| `/admin` | Administration summary |
| `/admin/users` | Sample members, demo roles, activation, and duplicate protection |
| `/admin/projects` | Sample projects, descriptions, archiving, and restoration |
| `/admin/settings` | Workspace name, description, and calendar week start |

With authentication unconfigured, these pages are explicitly labeled as a browser-local prototype. No real accounts, invitations, or server permissions are changed. Sample members and projects are available in task forms; deactivation and archiving preserve existing task references. At least one active demo administrator and project must remain.

Once authentication is configured, every workspace page validates the server session. Admin routes additionally require the signed-in Better Auth user ID to be listed in the server-only `ADMIN_USER_IDS` environment variable (comma-separated). An empty allowlist grants nobody actual admin access. Editing a browser-local demo role never grants real administrator access. Restart after changing the allowlist.

Task and directory storage is still local to the browser even when a user is signed in. Shared database task storage, actual user management, invitations, and a complete task permission model remain future work.

Sign-in and sign-up share the home page's branding, gradient palette, and saved light/dark preference. Password visibility and existing validation are preserved. Database and Google OAuth configuration are still required for real sign-in.

## Local configuration

Node 24 and pnpm are used by this project. A git-ignored `.env` has been prepared locally with generated authentication and local database secrets. `.env.example` documents the variables without secrets.

If setting up another checkout, copy `.env.example` to `.env`, then generate independent secrets:

```powershell
node -e 'console.log(require("node:crypto").randomBytes(32).toString("base64"))'
```

Set `BETTER_AUTH_SECRET` to the generated value. Keep `BETTER_AUTH_URL=http://localhost:3000` for development.

## PostgreSQL

The selected setup is hosted PostgreSQL using Neon. No local PostgreSQL server or Docker installation is needed. `DATABASE_URL` is currently blank; authentication cannot create accounts or sessions until it is configured.

### Hosted PostgreSQL with Neon

1. Sign in at https://console.neon.tech/ and create a project named `taskmanager`.
2. Choose an available region near your users. Use a dedicated development database for this setup.
3. Open **Connect**, select the database and role, and enable **Connection pooling**.
4. Copy the PostgreSQL connection string into the existing `DATABASE_URL=` line in `.env`. Preserve its TLS parameters. Do not put the URL in a `NEXT_PUBLIC_` variable or commit it.
5. Keep the existing generated `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL=http://localhost:3000`.
6. Run the authentication table commands below, then restart the app.

The pooled hostname includes `-pooler`. The existing `pg` driver connects directly to Neon; no Neon SDK or separate hosted authentication service is required. Keep certificate verification enabled.

Reference: https://neon.com/docs/get-started-with-neon/connect-neon

### Optional alternative: local PostgreSQL with Docker Desktop

Docker Desktop must be installed and running. The included Compose configuration binds PostgreSQL to localhost port 5433 and stores data in a persistent volume.

1. Set `POSTGRES_PASSWORD` in `.env` (already generated in this checkout).
2. Set `DATABASE_URL=postgresql://taskmanager:YOUR_POSTGRES_PASSWORD@localhost:5433/taskmanager`, substituting the same password. URL-encode reserved characters if you choose your own password.
3. Start PostgreSQL:

```powershell
pnpm db:up
```

`pnpm db:stop` stops the database while preserving its data. Changing `POSTGRES_PASSWORD` later does not change an existing database user's password.

### Create authentication tables

```powershell
pnpm auth:check
pnpm auth:migrate
pnpm dev
```

`auth:check` previews required schema changes. `auth:migrate` applies Better Auth's migrations, including the database-backed rate-limit table. Review the preview before applying to an existing database.

Visit http://localhost:3000/sign-up to create an account.

## Google sign-in

1. Open https://console.cloud.google.com/ and select or create a project.
2. Configure the Google Auth Platform branding, audience, and OAuth consent screen. Add test users if the application is in testing mode.
3. Create an OAuth client ID with application type **Web application**.
4. Add authorized JavaScript origin `http://localhost:3000`.
5. Add this exact authorized redirect URI: `http://localhost:3000/api/auth/callback/google`.
6. Put the client ID and secret in `.env` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
7. Restart the app. For a production build, rebuild after changing provider configuration.

Both Google variables must be set before the Google button is enabled. The client secret remains on the server. PostgreSQL is also required for Google sign-in.

For deployment, set `BETTER_AUTH_URL` to the public HTTPS origin and register its `/api/auth/callback/google` redirect URI with Google.

Reference: https://better-auth.com/docs/authentication/google

## Current authentication behavior

- `/sign-in` and `/sign-up`: email/password forms and Google sign-in.
- Workspace routes: browser-local prototype before authentication setup; server-validated session required after setup.
- `/`: public product presentation page.
- `/preview`: browser-local sample workspace, separate from the authenticated dashboard.
- `/api/auth/*`: Better Auth endpoints; return 503 until environment configuration is present.
- Passwords require 12-128 characters; Better Auth hashes them.
- Sessions expire after seven days and refresh after one day of activity.
- Rate limits persist in PostgreSQL, including five email login attempts per minute.
- Signup is public. Demo roles exist in the admin prototype; real admin page access uses `ADMIN_USER_IDS`. Invitations, email verification, and password reset emails are not implemented yet.
- Automatic account linking is disabled until email verification is implemented. Use the original login method for an existing email address; choosing another method does not automatically merge accounts.
- Call `requireSession()` inside future protected pages, server actions, and data access functions. Future API endpoints must validate sessions and enforce task/user permissions separately. Hiding UI is not authorization.
- Session data is not placed in a shared application cache.

## Validation

```powershell
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

After connecting PostgreSQL, verify account creation, invalid-password rejection, sign-out, session persistence after refresh, and blocked access to `/dashboard` after sign-out. Google sign-in additionally requires real OAuth credentials and browser consent.
