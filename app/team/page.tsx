import type { Metadata } from "next";
import { WorkspaceRoute } from "@/components/workspace-route";
import { TeamPageContent } from "@/components/workspace-pages";

export const metadata: Metadata = {
  title: "Team | Coliconstruct",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <WorkspaceRoute section="team">
      <TeamPageContent />
    </WorkspaceRoute>
  );
}
