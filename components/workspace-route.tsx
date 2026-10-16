import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { WorkspaceHome } from "./workspace-home";
import { getWorkspaceAccess } from "@/lib/workspace-access";
import type { WorkspaceSection } from "@/lib/workspace-navigation";
import type { ReactNode } from "react";
import "@/app/workspace.css";

async function Content({
  section,
  children,
}: {
  section: WorkspaceSection;
  children?: ReactNode;
}) {
  await connection();
  const access = await getWorkspaceAccess();
  if (section === "admin" && !access.isAdmin) {
    return (
      <main className="access-denied">
        <div>
          <span className="eyebrow">WORKSPACE ACCESS</span>
          <h1>Administrator access required</h1>
          <p>
            Your account can use the workspace. This area is reserved for
            administrators.
          </p>
          <Link href="/dashboard" className="primary-button">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return (
    <WorkspaceHome
      key={section}
      today={today}
      initialPage={section}
      routed
      access={access}
    >
      {children}
    </WorkspaceHome>
  );
}

export function WorkspaceRoute(props: {
  section: WorkspaceSection;
  children?: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <main className="workspace-loading">Getting your workspace ready…</main>
      }
    >
      <Content {...props} />
    </Suspense>
  );
}
