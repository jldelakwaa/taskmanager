import type { Metadata } from "next";
import { WorkspaceRoute } from "@/components/workspace-route";
import { AdminWorkspace } from "@/components/admin-workspace";

export const metadata: Metadata = {
  title: "Administration | Coliconstruct",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <WorkspaceRoute section="admin">
      <AdminWorkspace key="settings" section="settings" />
    </WorkspaceRoute>
  );
}
