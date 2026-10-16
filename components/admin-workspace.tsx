"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Archive,
  ArrowUpRight,
  Check,
  CheckCheck,
  FolderClosed,
  LayoutDashboard,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useWorkspaceData, useWorkspaceTasks } from "./workspace-data";
import { localId } from "@/lib/local-id";
import type { AccessRole, Member, Project } from "@/lib/workspace-directory";

export type AdminSection = "overview" | "users" | "projects" | "settings";
const tabs = [
  { id: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
  { id: "users", label: "Users & roles", href: "/admin/users", icon: Users },
  {
    id: "projects",
    label: "Projects",
    href: "/admin/projects",
    icon: FolderClosed,
  },
  {
    id: "settings",
    label: "Workspace settings",
    href: "/admin/settings",
    icon: Settings2,
  },
] as const;
const clean = (value: string) => value.trim().replace(/\s+/g, " ");

export function AdminWorkspace({ section }: { section: AdminSection }) {
  const { directory, saveDirectory } = useWorkspaceData();
  const tasks = useWorkspaceTasks();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null | undefined>(
    undefined,
  );
  const [editingProject, setEditingProject] = useState<
    Project | null | undefined
  >(undefined);
  const [archived, setArchived] = useState(false);
  const activeAdmins = directory.members.filter(
    (member) => member.active && member.accessRole === "Admin",
  ).length;
  const members = directory.members.filter(
    (member) =>
      (role === "all" || member.accessRole === role) &&
      `${member.name} ${member.email} ${member.role}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const projects = directory.projects.filter(
    (project) =>
      (archived || !project.archived) &&
      `${project.name} ${project.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  function saveMember(member: Member) {
    setError("");
    if (
      directory.members.some(
        (item) =>
          item.id !== member.id &&
          item.email.trim().toLowerCase() === member.email.trim().toLowerCase(),
      )
    ) {
      setError("A sample member with this email already exists.");
      return;
    }
    const previous = directory.members.find((item) => item.id === member.id);
    if (
      previous?.active &&
      previous.accessRole === "Admin" &&
      (!member.active || member.accessRole !== "Admin") &&
      activeAdmins <= 1
    ) {
      setError("Keep at least one active sample administrator.");
      return;
    }
    const next = editingMember
      ? directory.members.map((item) => (item.id === member.id ? member : item))
      : [...directory.members, member];
    if (!saveDirectory({ ...directory, members: next })) {
      setError("Unable to save. Check that browser storage is available.");
      return;
    }
    setEditingMember(undefined);
    setMessage(
      "Sample member saved. No account or email invitation was created.",
    );
  }
  function toggleMember(member: Member) {
    setError("");
    if (member.active && member.accessRole === "Admin" && activeAdmins <= 1) {
      setError("Keep at least one active sample administrator.");
      return;
    }
    if (
      !saveDirectory({
        ...directory,
        members: directory.members.map((item) =>
          item.id === member.id ? { ...item, active: !item.active } : item,
        ),
      })
    ) {
      setError("Unable to save. Check browser storage.");
      return;
    }
    setMessage(
      `Sample member ${member.active ? "deactivated" : "reactivated"}. Real account access is unchanged.`,
    );
  }
  function saveProject(project: Project) {
    setError("");
    if (
      directory.projects.some(
        (item) =>
          item.id !== project.id &&
          clean(item.name).toLowerCase() === clean(project.name).toLowerCase(),
      )
    ) {
      setError("A project with this name already exists.");
      return;
    }
    const next = editingProject
      ? directory.projects.map((item) =>
          item.id === project.id ? project : item,
        )
      : [...directory.projects, project];
    if (!saveDirectory({ ...directory, projects: next })) {
      setError("Unable to save. Check browser storage.");
      return;
    }
    setEditingProject(undefined);
    setMessage("Sample project saved. It is available when creating a task.");
  }
  function toggleProject(project: Project) {
    setError("");
    if (
      !project.archived &&
      directory.projects.filter((item) => !item.archived).length <= 1
    ) {
      setError("Keep at least one active project for new tasks.");
      return;
    }
    if (
      !saveDirectory({
        ...directory,
        projects: directory.projects.map((item) =>
          item.id === project.id ? { ...item, archived: !item.archived } : item,
        ),
      })
    ) {
      setError("Unable to save. Check browser storage.");
      return;
    }
    setMessage(
      project.archived
        ? "Project restored."
        : "Project archived. Existing tasks are preserved.",
    );
  }
  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const name = clean(String(form.get("name") ?? ""));
    if (!name) {
      setError("Enter a workspace name.");
      return;
    }
    if (
      !saveDirectory({
        ...directory,
        settings: {
          name,
          description: clean(String(form.get("description") ?? "")),
          weekStartsOn: form.get("weekStartsOn") as "Sunday" | "Monday",
        },
      })
    ) {
      setError("Unable to save. Check browser storage.");
      return;
    }
    setMessage("Workspace settings saved in this browser.");
  }

  return (
    <div className="workspace-page-stack">
      <div className="admin-preview-banner">
        <ShieldCheck size={20} />
        <div>
          <strong>Administration preview</strong>
          <p>
            Manage sample members, projects, and workspace settings. These
            changes stay in this browser and do not modify real accounts or
            permissions.
          </p>
        </div>
      </div>
      <nav className="admin-tabs" aria-label="Administration pages">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={section === tab.id ? "active" : ""}
            aria-current={section === tab.id ? "page" : undefined}
          >
            <tab.icon size={16} />
            {tab.label}
          </Link>
        ))}
      </nav>
      {message && (
        <div className="workspace-success" role="status">
          <Check size={16} />
          {message}
          <button
            aria-label="Dismiss confirmation"
            onClick={() => setMessage("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {error && editingMember === undefined && editingProject === undefined && (
        <div className="workspace-notice" role="alert">
          {error}
        </div>
      )}
      {section === "overview" && (
        <>
          <div className="stats-grid admin-stats">
            {[
              {
                label: "Team members",
                value: directory.members.length,
                icon: Users,
                note: `${directory.members.filter((member) => member.active).length} active members`,
              },
              {
                label: "Administrators",
                value: activeAdmins,
                icon: ShieldCheck,
                note: "Sample administrator roles",
              },
              {
                label: "Active projects",
                value: directory.projects.filter((project) => !project.archived)
                  .length,
                icon: FolderClosed,
                note: "Spaces for your team's work",
              },
              {
                label: "Workspace tasks",
                value: tasks.length,
                icon: CheckCheck,
                note: `${tasks.filter((task) => task.status === "Done").length} completed tasks`,
              },
            ].map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-card-top">
                  <span>{stat.label}</span>
                  <span className="stat-icon stat-blue">
                    <stat.icon size={19} />
                  </span>
                </div>
                <strong>{String(stat.value).padStart(2, "0")}</strong>
                <span className="stat-note">{stat.note}</span>
              </article>
            ))}
          </div>
          <section className="workspace-panel">
            <header>
              <div>
                <h2>A clear view of your workspace.</h2>
                <p>Keep the people, projects, and preferences in order.</p>
              </div>
            </header>
            <div className="admin-shortcuts">
              {tabs.slice(1).map((tab) => (
                <Link key={tab.id} href={tab.href}>
                  <tab.icon size={23} />
                  <h3>{tab.label}</h3>
                  <p>
                    {tab.id === "users"
                      ? "Maintain sample team members and their demo roles."
                      : tab.id === "projects"
                        ? "Create project spaces and archive completed work areas."
                        : "Set the workspace name and calendar week start."}
                  </p>
                  <span>
                    Manage <ArrowUpRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <section className="workspace-panel">
            <header>
              <div>
                <h2>Roles at a glance</h2>
                <p>
                  Demo role distribution. Real administrator access is
                  configured on the server.
                </p>
              </div>
            </header>
            <div className="admin-role-summary">
              {["Admin", "Manager", "Member"].map((item) => (
                <div key={item}>
                  <span className={`access-role role-${item.toLowerCase()}`}>
                    {item}
                  </span>
                  <strong>
                    {
                      directory.members.filter(
                        (member) => member.accessRole === item,
                      ).length
                    }
                  </strong>
                  <span>sample members</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
      {section === "users" && (
        <section className="workspace-panel admin-table-panel">
          <div className="workspace-section-toolbar">
            <div>
              <h2>People make the workspace.</h2>
              <p>Add sample members and organize their demo roles.</p>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                setError("");
                setEditingMember(null);
              }}
            >
              <Plus size={16} />
              Add sample member
            </button>
          </div>
          <div className="workspace-section-toolbar filter-toolbar">
            <label className="workspace-search">
              <Search size={15} />
              <input
                aria-label="Search members"
                placeholder="Search name or email…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <select
              aria-label="Filter by role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="all">All roles</option>
              {["Admin", "Manager", "Member"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Assigned tasks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="admin-member">
                        <span className={`avatar avatar-${member.color}`}>
                          {member.initials}
                        </span>
                        <span>
                          <strong>{member.name}</strong>
                          <small>{member.email}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`access-role role-${member.accessRole.toLowerCase()}`}
                      >
                        {member.accessRole}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`member-state ${member.active ? "active" : "inactive"}`}
                      >
                        <i />
                        {member.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {
                        tasks.filter((task) => task.assignee === member.id)
                          .length
                      }
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button
                          aria-label={`Edit ${member.name}`}
                          onClick={() => {
                            setError("");
                            setEditingMember(member);
                          }}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          aria-label={`${member.active ? "Deactivate" : "Reactivate"} ${member.name}`}
                          onClick={() => toggleMember(member)}
                        >
                          {member.active ? "Deactivate" : "Reactivate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!members.length && (
            <div className="workspace-empty">
              <Users size={26} />
              <h3>No matching members</h3>
              <p>Try another search or role filter.</p>
            </div>
          )}
        </section>
      )}
      {section === "projects" && (
        <>
          <div className="workspace-section-toolbar">
            <div>
              <h2>A space for every kind of work.</h2>
              <p>Projects connect task planning across the workspace.</p>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                setError("");
                setEditingProject(null);
              }}
            >
              <Plus size={16} />
              New project
            </button>
          </div>
          <div className="workspace-section-toolbar">
            <label className="workspace-search">
              <Search size={15} />
              <input
                aria-label="Search projects"
                placeholder="Find a project…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label className="workspace-checkbox">
              <input
                type="checkbox"
                checked={archived}
                onChange={(event) => setArchived(event.target.checked)}
              />
              Include archived
            </label>
          </div>
          <div className="directory-grid">
            {projects.map((project) => {
              const assigned = tasks.filter(
                (task) => task.project === project.name,
              );
              const done = assigned.filter(
                (task) => task.status === "Done",
              ).length;
              return (
                <article
                  className="directory-card project-card"
                  key={project.id}
                >
                  <div className="directory-card-top">
                    <span className="workspace-panel-symbol">
                      <FolderClosed size={22} />
                    </span>
                    <span
                      className={`member-state ${project.archived ? "inactive" : "active"}`}
                    >
                      <i />
                      {project.archived ? "Archived" : "Active"}
                    </span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>
                    {project.description ||
                      "A shared space for your team's tasks."}
                  </p>
                  <div className="directory-card-stats">
                    <span>{assigned.length} tasks</span>
                    <span>{done} completed</span>
                  </div>
                  <div className="directory-progress">
                    <span
                      style={{
                        width: `${assigned.length ? (done / assigned.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <footer>
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setError("");
                        setEditingProject(project);
                      }}
                    >
                      <Pencil size={13} />
                      Edit details
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => toggleProject(project)}
                    >
                      <Archive size={13} />
                      {project.archived ? "Restore" : "Archive"}
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
          {!projects.length && (
            <div className="workspace-empty">
              <FolderClosed size={26} />
              <h3>No matching projects</h3>
              <p>Try another search or include archived projects.</p>
            </div>
          )}
        </>
      )}
      {section === "settings" && (
        <section className="workspace-panel workspace-settings-panel">
          <header>
            <span className="workspace-panel-symbol">
              <Settings2 size={22} />
            </span>
            <div>
              <h2>A workspace that feels like yours.</h2>
              <p>
                These settings apply to the sample workspace on this browser.
              </p>
            </div>
          </header>
          <form onSubmit={saveSettings} className="workspace-settings-form">
            <label>
              Workspace name
              <input
                name="name"
                required
                maxLength={70}
                defaultValue={directory.settings.name}
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                rows={3}
                maxLength={300}
                defaultValue={directory.settings.description}
              />
            </label>
            <div className="form-row">
              <label>
                Calendar week starts on
                <select
                  name="weekStartsOn"
                  defaultValue={directory.settings.weekStartsOn}
                >
                  <option>Sunday</option>
                  <option>Monday</option>
                </select>
              </label>
              <label>
                Time zone
                <input readOnly value="Asia/Manila (UTC+08:00)" />
              </label>
            </div>
            <footer>
              <span className="workspace-form-note">
                Task records and account permissions are preserved.
              </span>
              <button className="primary-button" type="submit">
                <Check size={16} />
                Save settings
              </button>
            </footer>
          </form>
        </section>
      )}
      {editingMember !== undefined && (
        <MemberDialog
          member={editingMember}
          error={error}
          onClose={() => {
            setEditingMember(undefined);
            setError("");
          }}
          onSave={saveMember}
        />
      )}
      {editingProject !== undefined && (
        <ProjectDialog
          project={editingProject}
          error={error}
          onClose={() => {
            setEditingProject(undefined);
            setError("");
          }}
          onSave={saveProject}
        />
      )}
    </div>
  );
}

function MemberDialog({
  member,
  error,
  onClose,
  onSave,
}: {
  member: Member | null;
  error: string;
  onClose: () => void;
  onSave: (member: Member) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = clean(String(form.get("name") ?? ""));
    if (!name) return;
    onSave({
      id: member?.id ?? localId(),
      name,
      email: String(form.get("email")).trim().toLowerCase(),
      role: clean(String(form.get("job") ?? "")),
      accessRole: form.get("accessRole") as AccessRole,
      active: member?.active ?? true,
      color: member?.color ?? "blue",
      initials: name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
    });
  }
  return (
    <dialog
      ref={ref}
      className="task-dialog directory-dialog"
      onCancel={onClose}
      aria-labelledby="member-dialog-title"
    >
      <form onSubmit={submit}>
        <header>
          <div>
            <span className="eyebrow">DEMO DIRECTORY</span>
            <h2 id="member-dialog-title">
              {member ? "Edit sample member" : "Add sample member"}
            </h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close member editor"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <label>
          Full name
          <input
            name="name"
            required
            maxLength={100}
            defaultValue={member?.name}
            autoFocus
          />
        </label>
        <label>
          Email (demo)
          <input
            name="email"
            required
            type="email"
            maxLength={254}
            defaultValue={member?.email}
          />
        </label>
        <div className="form-row">
          <label>
            Job title
            <input name="job" maxLength={80} defaultValue={member?.role} />
          </label>
          <label>
            Demo role
            <select
              name="accessRole"
              defaultValue={member?.accessRole ?? "Member"}
            >
              <option>Member</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>
          </label>
        </div>
        {error && (
          <p className="dialog-error" role="alert">
            {error}
          </p>
        )}
        <p className="workspace-form-note">
          This creates a sample directory entry. No login account or invitation
          is created.
        </p>
        <footer>
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            <UserCheck size={16} />
            Save member
          </button>
        </footer>
      </form>
    </dialog>
  );
}

function ProjectDialog({
  project,
  error,
  onClose,
  onSave,
}: {
  project: Project | null;
  error: string;
  onClose: () => void;
  onSave: (project: Project) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = project?.name ?? clean(String(form.get("name") ?? ""));
    if (!name) return;
    onSave({
      id: project?.id ?? localId(),
      name,
      description: clean(String(form.get("description") ?? "")),
      archived: project?.archived ?? false,
    });
  }
  return (
    <dialog
      ref={ref}
      className="task-dialog directory-dialog"
      onCancel={onClose}
      aria-labelledby="project-dialog-title"
    >
      <form onSubmit={submit}>
        <header>
          <div>
            <span className="eyebrow">WORKSPACE PROJECTS</span>
            <h2 id="project-dialog-title">
              {project ? "Edit project details" : "Create a project"}
            </h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close project editor"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <label>
          Project name
          <input
            name="name"
            required
            maxLength={80}
            defaultValue={project?.name}
            readOnly={Boolean(project)}
            autoFocus
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            rows={4}
            maxLength={300}
            defaultValue={project?.description}
          />
        </label>
        {error && (
          <p className="dialog-error" role="alert">
            {error}
          </p>
        )}
        <footer>
          <button className="secondary-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            <Check size={16} />
            Save project
          </button>
        </footer>
      </form>
    </dialog>
  );
}
