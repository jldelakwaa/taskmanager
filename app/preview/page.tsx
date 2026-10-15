import { Suspense } from "react";
import { connection } from "next/server";
import { WorkspaceHome } from "@/components/workspace-home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace preview | Coliconstruct Task Manager",
  robots: { index: false, follow: true },
};

async function Workspace() {
  await connection();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return <WorkspaceHome today={today} />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="workspace-loading">Getting your workspace ready…</main>
      }
    >
      <Workspace />
    </Suspense>
  );
}
