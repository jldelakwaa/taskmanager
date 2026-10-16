import { TEAM } from "./preview-tasks";

export type AccessRole = "Admin" | "Manager" | "Member";
export type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  color: string;
  accessRole: AccessRole;
  active: boolean;
};
export type Project = {
  id: string;
  name: string;
  description: string;
  archived: boolean;
};
export type Directory = {
  members: Member[];
  projects: Project[];
  settings: {
    name: string;
    description: string;
    weekStartsOn: "Sunday" | "Monday";
  };
};
export const DIRECTORY_KEY = "coliconstruct-workspace-directory-v1";
export const DIRECTORY_EVENT = "coliconstruct-directory-change";
export const DEFAULT_DIRECTORY: Directory = {
  members: TEAM.map((person, index) => ({
    ...person,
    email: `${person.id}@example.com`,
    accessRole: index === 0 ? "Admin" : index === 1 ? "Manager" : "Member",
    active: true,
  })),
  projects: [
    {
      id: "engineering",
      name: "Engineering",
      description: "Drawings, technical reviews, and project coordination.",
      archived: false,
    },
    {
      id: "operations",
      name: "Operations",
      description: "Reports, purchasing, and day-to-day coordination.",
      archived: false,
    },
    {
      id: "site-works",
      name: "Site works",
      description: "Site inspections, materials, and safety checks.",
      archived: false,
    },
  ],
  settings: {
    name: "Coliconstruct",
    description: "A shared place to plan our work and move forward together.",
    weekStartsOn: "Sunday",
  },
};

export function parseDirectory(raw: string | null): Directory {
  if (!raw) return DEFAULT_DIRECTORY;
  try {
    const value = JSON.parse(raw) as Directory;
    if (
      !Array.isArray(value.members) ||
      !Array.isArray(value.projects) ||
      !value.settings
    )
      return DEFAULT_DIRECTORY;
    if (
      !value.members.every(
        (member) =>
          typeof member.id === "string" &&
          typeof member.name === "string" &&
          typeof member.email === "string" &&
          typeof member.role === "string" &&
          typeof member.initials === "string" &&
          ["blue", "purple", "orange"].includes(member.color) &&
          ["Admin", "Manager", "Member"].includes(member.accessRole) &&
          typeof member.active === "boolean",
      )
    )
      return DEFAULT_DIRECTORY;
    if (
      !value.projects.every(
        (project) =>
          typeof project.id === "string" &&
          typeof project.name === "string" &&
          typeof project.description === "string" &&
          typeof project.archived === "boolean",
      )
    )
      return DEFAULT_DIRECTORY;
    if (
      typeof value.settings.name !== "string" ||
      typeof value.settings.description !== "string" ||
      !["Sunday", "Monday"].includes(value.settings.weekStartsOn)
    )
      return DEFAULT_DIRECTORY;
    return value;
  } catch {
    return DEFAULT_DIRECTORY;
  }
}
