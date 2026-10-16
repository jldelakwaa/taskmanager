import type { Metadata } from "next";
import { WorkspaceRoute } from "@/components/workspace-route";

export const metadata: Metadata = {
  title: "Tasks | Coliconstruct",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <WorkspaceRoute section="tasks"></WorkspaceRoute>;
}
