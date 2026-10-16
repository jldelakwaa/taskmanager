import type { Metadata } from "next";
import { WorkspaceRoute } from "@/components/workspace-route";
import { PreferencesContent } from "@/components/workspace-pages";

export const metadata: Metadata = {
  title: "Preferences | Coliconstruct",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <WorkspaceRoute section="settings">
      <PreferencesContent />
    </WorkspaceRoute>
  );
}
