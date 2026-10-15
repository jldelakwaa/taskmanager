"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  Circle,
  Clock3,
  FileChartColumn,
  LayoutGrid,
  ListTodo,
  Pause,
  Plus,
  Table2,
  Users,
} from "lucide-react";
import { SAMPLE_TASKS, STATUSES, TEAM, statusClass } from "@/lib/preview-tasks";

const views = [
  { id: "board", label: "Board", icon: LayoutGrid },
  { id: "table", label: "Table", icon: Table2 },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "report", label: "Daily report", icon: FileChartColumn },
] as const;
const icons = {
  "To do": Circle,
  "In progress": Clock3,
  Done: CheckCheck,
  "On Hold": Pause,
};

export function ProductPreview() {
  const [view, setView] = useState<(typeof views)[number]["id"]>("board");

  return (
    <div className="product-preview" id="product-preview">
      <div className="product-window-bar">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span>Coliconstruct / Task Manager</span>
        <span className="product-window-label">PREVIEW</span>
      </div>
      <div className="product-window-body">
        <aside className="product-mini-sidebar" aria-hidden="true">
          <span className="mini-app-icon">
            <LayoutGrid size={16} />
          </span>
          <LayoutGrid size={15} />
          <ListTodo size={15} />
          <CalendarDays size={15} />
          <FileChartColumn size={15} />
          <span className="mini-sidebar-bottom">
            <Users size={15} />
          </span>
        </aside>
        <div className="product-window-content">
          <div className="product-window-heading">
            <div>
              <span>YOUR TEAM WORKSPACE</span>
              <h2>Your work, in focus.</h2>
              <p>A clear plan. A shared sense of progress.</p>
            </div>
            <span className="mock-add-button" aria-hidden="true">
              <Plus size={12} />
              New task
            </span>
          </div>
          <div className="product-mini-stats">
            {[
              { label: "Total tasks", value: "08", icon: LayoutGrid },
              { label: "In progress", value: "02", icon: Clock3 },
              { label: "Completed", value: "02", icon: CheckCheck },
            ].map((item) => (
              <div key={item.label}>
                <span>
                  {item.label}
                  <item.icon size={12} />
                </span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <div
            className="product-view-tabs"
            role="group"
            aria-label="Explore product views"
          >
            {views.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                aria-pressed={view === item.id}
                className={view === item.id ? "selected" : ""}
              >
                <item.icon size={12} />
                {item.label}
              </button>
            ))}
          </div>
          <div className="product-demo-content" aria-live="polite">
            {view === "board" && (
              <div className="product-demo-board">
                {STATUSES.map((status) => {
                  const Icon = icons[status];
                  return (
                    <div
                      key={status}
                      className={`mini-column ${statusClass(status)}`}
                    >
                      <h3>
                        <Icon size={11} />
                        {status}
                        <span>
                          {
                            SAMPLE_TASKS.filter(
                              (task) => task.status === status,
                            ).length
                          }
                        </span>
                      </h3>
                      {SAMPLE_TASKS.filter((task) => task.status === status)
                        .slice(0, 1)
                        .map((task) => (
                          <div className="mini-task" key={task.id}>
                            <span
                              className={`mini-project ${task.project === "Engineering" ? "engineering" : task.project === "Operations" ? "operations" : "site"}`}
                            >
                              {task.project}
                            </span>
                            <h4>{task.title}</h4>
                            <span
                              className={`mini-priority ${task.priority.toLowerCase()}`}
                            >
                              {task.priority} priority
                            </span>
                            <footer>
                              <span>
                                <CalendarDays size={9} />
                                Oct {task.date.slice(-2)}
                              </span>
                              <span className="mini-avatar">
                                {
                                  TEAM.find(
                                    (member) => member.id === task.assignee,
                                  )?.initials
                                }
                              </span>
                            </footer>
                          </div>
                        ))}
                    </div>
                  );
                })}
              </div>
            )}
            {view === "table" && (
              <div className="product-demo-table">
                <div className="mini-table-header">
                  <span>Task name</span>
                  <span>Assignee</span>
                  <span>Status</span>
                </div>
                {SAMPLE_TASKS.slice(0, 4).map((task) => (
                  <div className="mini-table-row" key={task.id}>
                    <span>
                      <i
                        className={`mini-checkbox ${task.status === "Done" ? "checked" : ""}`}
                      >
                        {task.status === "Done" && <Check size={9} />}
                      </i>
                      {task.title}
                    </span>
                    <span className="mini-table-person">
                      {TEAM.find((person) => person.id === task.assignee)?.name}
                    </span>
                    <span className={`mini-status ${statusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {view === "calendar" && (
              <div className="product-demo-calendar">
                <div className="mini-calendar-heading">
                  <strong>October 2026</strong>
                  <span>Month view</span>
                </div>
                <div className="mini-calendar-grid">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <span className="mini-weekday" key={day}>
                      {day}
                    </span>
                  ))}
                  {[5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23].map(
                    (day) => (
                      <div key={day} className={day === 15 ? "mini-today" : ""}>
                        <span>{day}</span>
                        {day === 15 && (
                          <>
                            <p className="blue-event">Review drawings</p>
                            <p className="green-event">Safety checklist</p>
                          </>
                        )}
                        {day === 16 && (
                          <p className="blue-event">Progress report</p>
                        )}
                        {day === 13 && (
                          <p className="yellow-event">Team coordination</p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
            {view === "report" && (
              <div className="product-demo-report">
                <div className="mini-report-heading">
                  <strong>Team daily report</strong>
                  <span>
                    <CalendarDays size={11} />
                    October 15, 2026
                  </span>
                </div>
                {TEAM.map((person) => {
                  const tasks = SAMPLE_TASKS.filter(
                    (task) =>
                      task.assignee === person.id && task.date === "2026-10-15",
                  );
                  return (
                    <div className="mini-person-report" key={person.id}>
                      <span className={`mini-person-avatar ${person.color}`}>
                        {person.initials}
                      </span>
                      <div>
                        <strong>{person.name}</strong>
                        <span>
                          {tasks.map((task) => task.title).join(" · ")}
                        </span>
                      </div>
                      <span className="mini-report-count">
                        {tasks.length} tasks
                      </span>
                    </div>
                  );
                })}
                <div className="mini-report-note">
                  <CheckCheck size={13} />
                  One day. Every team member. A clearer picture.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="product-preview-footer">
        <span>
          <span />
          Illustrative sample workspace
        </span>
        <Link href="/preview">
          Open interactive preview
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
