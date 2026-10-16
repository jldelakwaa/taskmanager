"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  CheckCheck,
  FolderClosed,
  Moon,
  Search,
  Sun,
  Users,
} from "lucide-react";
import { useWorkspaceData, useWorkspaceTasks } from "./workspace-data";
import { useMarketingTheme } from "./marketing-theme";

export function TeamPageContent() {
  const { directory } = useWorkspaceData();
  const tasks = useWorkspaceTasks();
  const [query, setQuery] = useState("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const members = directory.members.filter(
    (person) =>
      (includeInactive || person.active) &&
      `${person.name} ${person.role} ${person.email}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="workspace-page-stack">
      <div className="workspace-section-toolbar">
        <div>
          <h2>Your people. A shared purpose.</h2>
          <p>A sample directory of the people moving work forward.</p>
        </div>
        <label className="workspace-search">
          <Search size={16} />
          <input
            aria-label="Search team"
            placeholder="Find a team member…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <label className="workspace-checkbox">
        <input
          type="checkbox"
          checked={includeInactive}
          onChange={(event) => setIncludeInactive(event.target.checked)}
        />
        Include inactive members
      </label>
      <div className="directory-grid">
        {members.map((person) => {
          const assigned = tasks.filter((task) => task.assignee === person.id);
          const complete = assigned.filter(
            (task) => task.status === "Done",
          ).length;
          return (
            <article className="directory-card" key={person.id}>
              <div className="directory-card-top">
                <span className={`avatar avatar-${person.color}`}>
                  {person.initials}
                </span>
                <span
                  className={`access-role role-${person.accessRole.toLowerCase()}`}
                >
                  {person.accessRole}
                </span>
              </div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <span className="directory-email">{person.email}</span>
              <div className="directory-card-stats">
                <span>
                  <FolderClosed size={14} />
                  {assigned.length} tasks
                </span>
                <span>
                  <CheckCheck size={14} />
                  {complete} completed
                </span>
              </div>
              <div className="directory-progress">
                <span
                  style={{
                    width: `${assigned.length ? (complete / assigned.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span
                className={`member-state ${person.active ? "active" : "inactive"}`}
              >
                <i />
                {person.active ? "Active member" : "Inactive member"}
              </span>
            </article>
          );
        })}
      </div>
      {!members.length && (
        <div className="workspace-empty">
          <Users size={28} />
          <h3>No team members found</h3>
          <p>Try another name or include inactive members.</p>
        </div>
      )}
      <div className="workspace-inline-note">
        Sample members are managed in the admin area. Their roles do not change
        real account access.
      </div>
    </div>
  );
}

export function PreferencesContent() {
  const { theme, setTheme } = useMarketingTheme();
  return (
    <div className="workspace-page-stack">
      <section className="workspace-panel">
        <header>
          <span className="workspace-panel-symbol">
            <Sun size={21} />
          </span>
          <div>
            <h2>Make yourself at home.</h2>
            <p>Choose the appearance that feels right for your day.</p>
          </div>
        </header>
        <div className="theme-choice-grid">
          {(
            [
              {
                id: "light",
                name: "Light",
                text: "Clean surfaces and clear blue accents.",
                icon: Sun,
              },
              {
                id: "dark",
                name: "Dark",
                text: "Deep navy tones for a quieter workspace.",
                icon: Moon,
              },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              className={`theme-choice ${option.id === theme ? "selected" : ""}`}
              aria-pressed={option.id === theme}
              onClick={() => setTheme(option.id)}
            >
              <div className={`theme-swatch swatch-${option.id}`}>
                <i />
                <span />
                <span />
              </div>
              <span>
                <option.icon size={17} />
                <strong>{option.name}</strong>
                {theme === option.id && (
                  <span className="selected-label">Selected</span>
                )}
              </span>
              <small>{option.text}</small>
            </button>
          ))}
        </div>
        <p className="workspace-form-note">
          Your choice is remembered on this browser and shared with the public
          page.
        </p>
      </section>
      <section className="workspace-panel">
        <header>
          <span className="workspace-panel-symbol">
            <FolderClosed size={21} />
          </span>
          <div>
            <h2>Workspace details</h2>
            <p>A few useful things to know.</p>
          </div>
        </header>
        <dl className="workspace-detail-list">
          <div>
            <dt>Time zone</dt>
            <dd>Asia/Manila (UTC+08:00)</dd>
          </div>
          <div>
            <dt>Data in this prototype</dt>
            <dd>Sample tasks and members, stored in this browser</dd>
          </div>
          <div>
            <dt>Task statuses</dt>
            <dd>To do · In progress · Done · On Hold</dd>
          </div>
        </dl>
        <Link href="/" className="workspace-open-link">
          Back to the public page <ArrowUpRight size={15} />
        </Link>
      </section>
    </div>
  );
}
