export const WORKSPACE_ROUTES = {
  overview: "/dashboard",
  tasks: "/tasks",
  calendar: "/calendar",
  reports: "/reports",
  team: "/team",
  settings: "/settings",
  admin: "/admin",
} as const;
export type WorkspaceSection = keyof typeof WORKSPACE_ROUTES;
