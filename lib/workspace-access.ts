import "server-only";
import { authConfigured } from "./auth";
import { requireSession } from "./session";

export type WorkspaceAccess = {
  mode: "preview" | "authenticated";
  isAdmin: boolean;
  name: string;
  email: string;
};

export async function getWorkspaceAccess(): Promise<WorkspaceAccess> {
  // The unconfigured application only contains explicitly labeled local demo data.
  if (!authConfigured())
    return {
      mode: "preview",
      isAdmin: true,
      name: "Workspace preview",
      email: "",
    };
  const { user } = await requireSession();
  const adminIds = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return {
    mode: "authenticated",
    isAdmin: adminIds.includes(user.id),
    name: user.name,
    email: user.email,
  };
}
