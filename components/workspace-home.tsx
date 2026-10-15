"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Flag,
  FolderClosed,
  GripVertical,
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  LogIn,
  Menu,
  MoreHorizontal,
  Pause,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Users,
  X,
  FileChartColumn,
  type LucideIcon,
} from "lucide-react";
import {
  calendarDays,
  displayDate,
  parseTasks,
  readStoredTasks,
  STATUSES,
  statusClass,
  storeTasks,
  subscribeToTasks,
  TEAM,
  type Status,
  type Task,
} from "@/lib/preview-tasks";

type Page = "overview" | "tasks" | "calendar" | "reports";
type View = "board" | "table" | "calendar";
const navItems: { id: Page; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks", label: "All tasks", icon: ListTodo },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "reports", label: "Daily report", icon: FileChartColumn },
];
const STATUS_ICONS = {
  "To do": Circle,
  "In progress": Clock3,
  Done: CheckCheck,
  "On Hold": Pause,
};

function Avatar({ id, small = false }: { id: string; small?: boolean }) {
  const person = TEAM.find((member) => member.id === id) ?? TEAM[0];
  return (
    <span
      className={`avatar avatar-${person.color}${small ? " avatar-small" : ""}`}
      title={person.name}
    >
      {person.initials}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`status-badge ${statusClass(status)}`}>
      <span />
      {status}
    </span>
  );
}

export function WorkspaceHome({ today }: { today: string }) {
  const raw = useSyncExternalStore(
    subscribeToTasks,
    readStoredTasks,
    () => null,
  );
  const tasks = useMemo(() => parseTasks(raw), [raw]);
  const [page, setPage] = useState<Page>("overview");
  const [view, setView] = useState<View>("board");
  const [query, setQuery] = useState("");
  const [assignee, setAssignee] = useState("all");
  const [status, setStatus] = useState("all");
  const [reportDate, setReportDate] = useState(today);
  const [month, setMonth] = useState(today.slice(0, 7) + "-01");
  const [editing, setEditing] = useState<Task | null | undefined>(undefined);
  const [newTaskStatus, setNewTaskStatus] = useState<Status>("To do");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [dropTarget, setDropTarget] = useState<Status | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const pageTitle = navItems.find((item) => item.id === page)!.label;
  const filtered = tasks.filter(
    (task) =>
      (assignee === "all" || task.assignee === assignee) &&
      (status === "all" || task.status === status) &&
      `${task.title} ${task.description} ${task.project}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  const completed = tasks.filter((task) => task.status === "Done").length;
  const visibleCount =
    page === "reports"
      ? filtered.filter((task) => task.date === reportDate).length
      : filtered.length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;
  const todayTasks = tasks
    .filter((task) => task.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") setSidebarOpen(false);
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  function navigate(next: Page) {
    setPage(next);
    setSidebarOpen(false);
    if (next === "calendar") setView("calendar");
    if (next === "tasks" && view === "calendar") setView("table");
  }

  function save(next: Task[]) {
    try {
      storeTasks(next);
      setNotice("");
      return true;
    } catch {
      setNotice(
        "Your browser could not save this change. Please allow browser storage and try again.",
      );
      return false;
    }
  }

  function openNew(nextStatus: Status = "To do") {
    setNewTaskStatus(nextStatus);
    setEditing(null);
  }

  function changeStatus(id: string, nextStatus: Status) {
    save(
      tasks.map((task) =>
        task.id === id ? { ...task, status: nextStatus } : task,
      ),
    );
  }

  function shiftMonth(direction: number) {
    const date = new Date(month + "T12:00:00");
    date.setMonth(date.getMonth() + direction);
    setMonth(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`,
    );
  }

  return (
    <div className="workspace-app">
      {sidebarOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`workspace-sidebar ${sidebarOpen ? "is-open" : ""}`}
        aria-label="Workspace navigation"
      >
        <Link href="/" className="brand-logo" aria-label="Coliconstruct home">
          <Image
            src="/brand/coliconstruct-logo.png"
            alt="Coliconstruct Engineering Services"
            width={2135}
            height={736}
            priority
          />
        </Link>
        <div className="workspace-identity">
          <div className="workspace-symbol">
            <LayoutGrid size={19} />
          </div>
          <div>
            <strong>Task Manager</strong>
            <span>Team workspace</span>
          </div>
          <span className="workspace-yellow-dot" />
        </div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={page === item.id ? "active" : ""}
              onClick={() => navigate(item.id)}
              aria-current={page === item.id ? "page" : undefined}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
              {item.id === "tasks" && (
                <span className="nav-count">{tasks.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-label team-label">
          YOUR TEAM <span>{TEAM.length}</span>
        </div>
        <div className="sidebar-team">
          {TEAM.map((person) => (
            <div key={person.id}>
              <Avatar id={person.id} small />
              <span>{person.name}</span>
              <span className="member-online" title="Sample team member" />
            </div>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="preview-note">
            <Sparkles size={18} />
            <strong>A preview of what’s next</strong>
            <p>Explore with sample tasks. Changes stay in this browser.</p>
            <span className="preview-note-tag">PREVIEW WORKSPACE</span>
          </div>
          <Link className="sidebar-signin" href="/sign-in">
            <span className="signin-avatar">
              <Users size={18} />
            </span>
            <span>
              <strong>Your team, together</strong>
              <small>Sign in to your account</small>
            </span>
            <LogIn size={17} />
          </Link>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumb">
            Workspace <ChevronRight size={14} />
            <span>{pageTitle}</span>
          </div>
          <label className="global-search">
            <Search size={17} />
            <input
              ref={searchRef}
              aria-label="Search tasks"
              placeholder="Search anything…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd>Ctrl K</kbd>
          </label>
          <span className="preview-indicator">
            <span />
            Preview
          </span>
          <Link className="topbar-signin" href="/sign-in">
            Sign in <ArrowUpRight size={15} />
          </Link>
        </header>

        <main className="workspace-content" id="main-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span /> A LITTLE CLARITY. A LOT OF PROGRESS.
              </div>
              <h1>
                {page === "overview" ? "Your work, in focus." : pageTitle}
              </h1>
              <p>
                {page === "overview"
                  ? "A clear plan for today. A little more progress every day."
                  : page === "calendar"
                    ? "Make time for the work that matters."
                    : page === "reports"
                      ? "A daily view of what’s on everyone’s plate."
                      : "Everything your team is working toward, in one place."}
              </p>
            </div>
            <button className="primary-button" onClick={() => openNew()}>
              <Plus size={18} />
              New task
            </button>
          </div>
          {notice && (
            <div role="alert" className="workspace-notice">
              {notice}
              <button
                aria-label="Dismiss message"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {page === "overview" && (
            <>
              <div className="overview-intro">
                <span>
                  <CalendarDays size={15} />
                  {new Intl.DateTimeFormat("en", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(today + "T12:00:00"))}
                </span>
                <span className="sample-label">Sample team & tasks</span>
              </div>
              <section className="stats-grid" aria-label="Task summary">
                {[
                  {
                    label: "Total tasks",
                    value: tasks.length,
                    icon: FolderClosed,
                    color: "blue",
                    note: "Across your workspace",
                  },
                  {
                    label: "In progress",
                    value: tasks.filter((task) => task.status === "In progress")
                      .length,
                    icon: Clock3,
                    color: "sky",
                    note: "Moving things forward",
                  },
                  {
                    label: "Completed",
                    value: completed,
                    icon: CheckCheck,
                    color: "green",
                    note: `${progress}% of all tasks`,
                  },
                  {
                    label: "On hold",
                    value: tasks.filter((task) => task.status === "On Hold")
                      .length,
                    icon: Pause,
                    color: "amber",
                    note: "Waiting for the next step",
                  },
                ].map((stat) => (
                  <article className="stat-card" key={stat.label}>
                    <div className="stat-card-top">
                      <span>{stat.label}</span>
                      <div className={`stat-icon stat-${stat.color}`}>
                        <stat.icon size={19} />
                      </div>
                    </div>
                    <strong>{String(stat.value).padStart(2, "0")}</strong>
                    <div className="stat-note">
                      {stat.label === "Completed" && (
                        <span className="tiny-progress">
                          <span style={{ width: `${progress}%` }} />
                        </span>
                      )}
                      {stat.note}
                    </div>
                  </article>
                ))}
              </section>
            </>
          )}

          <section
            className="tasks-section"
            aria-label={
              page === "reports" ? "Daily task report" : "Task workspace"
            }
          >
            <div className="section-heading">
              <div>
                <h2>
                  {page === "overview"
                    ? "Team tasks"
                    : page === "reports"
                      ? "Team daily report"
                      : page === "calendar"
                        ? "Team calendar"
                        : "All tasks"}
                  <span className="section-count">{visibleCount}</span>
                </h2>
                {page === "overview" && <p>Small steps. Shared progress.</p>}
              </div>
              {page !== "reports" && page !== "calendar" && (
                <div className="view-tabs" role="group" aria-label="Task view">
                  {(
                    [
                      { id: "board", label: "Board", icon: LayoutGrid },
                      { id: "table", label: "Table", icon: Table2 },
                      { id: "calendar", label: "Calendar", icon: CalendarDays },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      aria-pressed={view === tab.id}
                      className={view === tab.id ? "active" : ""}
                      onClick={() => setView(tab.id)}
                    >
                      <tab.icon size={15} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="task-toolbar">
              <div className="filter-group">
                <label className="filter-select">
                  <Users size={15} />
                  <select
                    aria-label="Filter by team member"
                    value={assignee}
                    onChange={(event) => setAssignee(event.target.value)}
                  >
                    <option value="all">All team members</option>
                    {TEAM.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="filter-select">
                  <SlidersHorizontal size={15} />
                  <select
                    aria-label="Filter by status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="all">All statuses</option>
                    {STATUSES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                {(query || assignee !== "all" || status !== "all") && (
                  <button
                    className="clear-filters"
                    onClick={() => {
                      setQuery("");
                      setAssignee("all");
                      setStatus("all");
                    }}
                  >
                    Clear filters <X size={12} />
                  </button>
                )}
              </div>
              <span className="toolbar-hint">
                {page === "reports"
                  ? "Tasks scheduled for the selected day"
                  : view === "board" && page !== "calendar"
                    ? "Drag a task to update its status"
                    : `${filtered.length} tasks in view`}
              </span>
            </div>

            {page === "reports" ? (
              <div className="daily-report">
                <div className="report-date">
                  <label htmlFor="report-date">
                    <CalendarDays size={18} />
                    Report date
                  </label>
                  <input
                    id="report-date"
                    type="date"
                    value={reportDate}
                    onChange={(event) => {
                      if (event.target.value) setReportDate(event.target.value);
                    }}
                  />
                </div>
                <div className="report-grid">
                  {TEAM.filter(
                    (person) => assignee === "all" || person.id === assignee,
                  ).map((person) => {
                    const personTasks = filtered
                      .filter(
                        (task) =>
                          task.assignee === person.id &&
                          task.date === reportDate,
                      )
                      .sort((a, b) => a.time.localeCompare(b.time));
                    return (
                      <article className="person-report" key={person.id}>
                        <header>
                          <Avatar id={person.id} />
                          <div>
                            <h3>{person.name}</h3>
                            <p>{person.role}</p>
                          </div>
                          <span className="section-count">
                            {personTasks.length}
                          </span>
                        </header>
                        <div className="report-statuses">
                          {STATUSES.map((item) => (
                            <span key={item} className={statusClass(item)}>
                              <i />
                              {
                                personTasks.filter(
                                  (task) => task.status === item,
                                ).length
                              }{" "}
                              {item}
                            </span>
                          ))}
                        </div>
                        {personTasks.length ? (
                          personTasks.map((task) => (
                            <button
                              className="report-task"
                              key={task.id}
                              onClick={() => setEditing(task)}
                            >
                              <span
                                className={`task-check ${statusClass(task.status)}`}
                              >
                                {task.status === "Done" && <Check size={12} />}
                              </span>
                              <span>
                                <strong>{task.title}</strong>
                                <small>
                                  {task.time || "All day"} · {task.project}
                                </small>
                              </span>
                              <ChevronRight size={15} />
                            </button>
                          ))
                        ) : (
                          <p className="empty-copy">
                            No tasks scheduled for this day.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : page === "calendar" || view === "calendar" ? (
              <div className="calendar-view">
                <div className="calendar-toolbar">
                  <h3>
                    {new Intl.DateTimeFormat("en", {
                      month: "long",
                      year: "numeric",
                    }).format(new Date(month + "T12:00:00"))}
                  </h3>
                  <div>
                    <button
                      className="secondary-button"
                      onClick={() => setMonth(today.slice(0, 7) + "-01")}
                    >
                      Today
                    </button>
                    <button
                      className="icon-button"
                      aria-label="Previous month"
                      onClick={() => shiftMonth(-1)}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label="Next month"
                      onClick={() => shiftMonth(1)}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="calendar-scroll">
                  <div className="calendar-grid">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div className="calendar-weekday" key={day}>
                          {day}
                        </div>
                      ),
                    )}
                    {calendarDays(month).map((day) => (
                      <div
                        key={day.date}
                        className={`calendar-day ${day.outside ? "outside" : ""} ${day.date === today ? "is-today" : ""}`}
                      >
                        <button
                          className="calendar-date"
                          aria-label={`View report for ${day.date}`}
                          onClick={() => {
                            setReportDate(day.date);
                            navigate("reports");
                          }}
                        >
                          {day.day}
                        </button>
                        {filtered
                          .filter((task) => task.date === day.date)
                          .map((task) => (
                            <button
                              key={task.id}
                              className={`calendar-event ${statusClass(task.status)}`}
                              onClick={() => setEditing(task)}
                              title={task.title}
                            >
                              <span>{task.time}</span>
                              {task.title}
                            </button>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : view === "table" ? (
              <div className="task-table-scroll">
                <table className="task-table">
                  <thead>
                    <tr>
                      <th>Task name</th>
                      <th>Assignee</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>
                        Scheduled date <ArrowDown size={12} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <button onClick={() => setEditing(task)}>
                            <span
                              className={`task-check ${statusClass(task.status)}`}
                            >
                              {task.status === "Done" && <Check size={12} />}
                            </span>
                            <span>
                              <strong>{task.title}</strong>
                              <small>{task.project}</small>
                            </span>
                          </button>
                        </td>
                        <td>
                          <div className="table-assignee">
                            <Avatar id={task.assignee} small />
                            {
                              TEAM.find((person) => person.id === task.assignee)
                                ?.name
                            }
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={task.status} />
                        </td>
                        <td>
                          <span
                            className={`priority priority-${task.priority.toLowerCase()}`}
                          >
                            <Flag size={12} />
                            {task.priority}
                          </span>
                        </td>
                        <td>{displayDate(task.date, today)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filtered.length && (
                  <div className="empty-state">
                    <Search size={24} />
                    <h3>No matching tasks</h3>
                    <p>Try a different search or clear your filters.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="task-board">
                {STATUSES.map((column) => {
                  const columnTasks = filtered.filter(
                    (task) => task.status === column,
                  );
                  const Icon = STATUS_ICONS[column];
                  return (
                    <div
                      key={column}
                      className={`board-column column-${statusClass(column)} ${dropTarget === column ? "drag-over" : ""}`}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDropTarget(column);
                      }}
                      onDragLeave={(event) => {
                        if (
                          !event.currentTarget.contains(
                            event.relatedTarget as Node | null,
                          )
                        )
                          setDropTarget(null);
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        const id = event.dataTransfer.getData("text/plain");
                        if (tasks.some((task) => task.id === id))
                          changeStatus(id, column);
                        setDropTarget(null);
                      }}
                    >
                      <div className="column-heading">
                        <Icon size={15} />
                        <h3>{column}</h3>
                        <span>{columnTasks.length}</span>
                        <button
                          className="icon-button"
                          aria-label={`Add task to ${column}`}
                          onClick={() => openNew(column)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="column-cards">
                        {columnTasks.map((task) => (
                          <article
                            key={task.id}
                            className="task-card"
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.setData("text/plain", task.id);
                              event.dataTransfer.effectAllowed = "move";
                            }}
                            onDragEnd={() => setDropTarget(null)}
                          >
                            <div className="task-card-top">
                              <span
                                className={`project-tag project-${task.project === "Engineering" ? "blue" : task.project === "Operations" ? "purple" : "teal"}`}
                              >
                                {task.project}
                              </span>
                              <button
                                className="card-menu"
                                aria-label={`Edit ${task.title}`}
                                onClick={() => setEditing(task)}
                              >
                                <MoreHorizontal size={18} />
                              </button>
                            </div>
                            <button
                              className={`task-title ${task.status === "Done" ? "is-completed" : ""}`}
                              onClick={() => setEditing(task)}
                            >
                              {task.title}
                            </button>
                            <p className="task-description">
                              {task.description}
                            </p>
                            <div className="task-card-meta">
                              <span
                                className={`priority priority-${task.priority.toLowerCase()}`}
                              >
                                <Flag size={11} />
                                {task.priority}
                              </span>
                              <label
                                className="card-status-control"
                                title="Change task status"
                              >
                                <GripVertical size={13} />
                                <select
                                  aria-label={`Status for ${task.title}`}
                                  value={task.status}
                                  onChange={(event) =>
                                    changeStatus(
                                      task.id,
                                      event.target.value as Status,
                                    )
                                  }
                                >
                                  {STATUSES.map((item) => (
                                    <option key={item}>{item}</option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <footer>
                              <span
                                className={`task-date ${task.date === today && task.status !== "Done" ? "due-today" : ""}`}
                              >
                                <CalendarDays size={12} />
                                {displayDate(task.date, today)}
                              </span>
                              <Avatar id={task.assignee} small />
                            </footer>
                          </article>
                        ))}
                        {!columnTasks.length && (
                          <div className="empty-column">
                            {query || assignee !== "all" || status !== "all"
                              ? "No matching tasks"
                              : "A little breathing room."}
                          </div>
                        )}
                        <button
                          className="add-column-task"
                          onClick={() => openNew(column)}
                        >
                          <Plus size={15} />
                          Add task
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {page === "overview" && (
            <section className="overview-bottom">
              <article className="today-agenda">
                <div className="bottom-card-heading">
                  <div>
                    <h2>On the agenda</h2>
                    <p>A little structure for your day.</p>
                  </div>
                  <button
                    aria-label="Open calendar"
                    className="icon-button"
                    onClick={() => navigate("calendar")}
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </div>
                {todayTasks.length ? (
                  todayTasks.slice(0, 4).map((task) => (
                    <button
                      className="agenda-item"
                      key={task.id}
                      onClick={() => setEditing(task)}
                    >
                      <time>{task.time || "Any time"}</time>
                      <span
                        className={`agenda-line ${statusClass(task.status)}`}
                      />
                      <span>
                        <strong>{task.title}</strong>
                        <small>
                          {
                            TEAM.find((person) => person.id === task.assignee)
                              ?.name
                          }
                        </small>
                      </span>
                      <StatusBadge status={task.status} />
                    </button>
                  ))
                ) : (
                  <p className="empty-copy">
                    Your day has room for something new.
                  </p>
                )}
              </article>
              <article className="team-progress">
                <div className="bottom-card-heading">
                  <div>
                    <h2>Better, together.</h2>
                    <p>Every contribution moves us forward.</p>
                  </div>
                  <Users size={20} />
                </div>
                {TEAM.map((person) => {
                  const assigned = tasks.filter(
                    (task) => task.assignee === person.id,
                  );
                  const done = assigned.filter(
                    (task) => task.status === "Done",
                  ).length;
                  return (
                    <div className="team-progress-row" key={person.id}>
                      <Avatar id={person.id} small />
                      <span>
                        <strong>{person.name}</strong>
                        <span className="person-progress-track">
                          <span
                            style={{
                              width: `${assigned.length ? (done / assigned.length) * 100 : 0}%`,
                            }}
                          />
                        </span>
                      </span>
                      <small>
                        {done}/{assigned.length} done
                      </small>
                    </div>
                  );
                })}
                <div className="team-progress-footer">
                  <span className="yellow-spark">
                    <Sparkles size={14} />
                  </span>
                  Great things happen one task at a time.
                </div>
              </article>
            </section>
          )}
          <footer className="workspace-footer">
            <span>Built around your work. Designed for your team.</span>
            <span>
              COLICONSTRUCT <span className="footer-dot">•</span> TASK MANAGER
            </span>
          </footer>
        </main>
      </div>
      {editing !== undefined && (
        <TaskDialog
          task={editing}
          initialDate={page === "reports" ? reportDate : today}
          initialStatus={newTaskStatus}
          onClose={() => setEditing(undefined)}
          onSave={(task) => {
            if (
              save(
                editing
                  ? tasks.map((item) => (item.id === task.id ? task : item))
                  : [...tasks, task],
              )
            )
              setEditing(undefined);
          }}
        />
      )}
    </div>
  );
}

function TaskDialog({
  task,
  initialDate,
  initialStatus,
  onClose,
  onSave,
}: {
  task: Task | null;
  initialDate: string;
  initialStatus: Status;
  onClose: () => void;
  onSave: (task: Task) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) {
      (
        event.currentTarget.elements.namedItem("title") as HTMLInputElement
      ).focus();
      return;
    }
    onSave({
      id: task?.id ?? crypto.randomUUID(),
      title,
      description: String(form.get("description") ?? "").trim(),
      status: form.get("status") as Status,
      priority: form.get("priority") as Task["priority"],
      assignee: String(form.get("assignee")),
      project: String(form.get("project")),
      date: String(form.get("date")),
      time: String(form.get("time")),
    });
  }
  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="task-dialog"
      aria-labelledby="task-dialog-title"
    >
      <form onSubmit={submit}>
        <header>
          <div>
            <span className="eyebrow">A STEP FORWARD</span>
            <h2 id="task-dialog-title">
              {task ? "Task details" : "Create a task"}
            </h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close task editor"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <label>
          Task name
          <input
            name="title"
            required
            maxLength={150}
            defaultValue={task?.title ?? ""}
            placeholder="What needs to get done?"
            autoFocus
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            rows={3}
            maxLength={2000}
            defaultValue={task?.description ?? ""}
            placeholder="Add a little context for your team…"
          />
        </label>
        <div className="form-row">
          <label>
            Assignee
            <select name="assignee" defaultValue={task?.assignee ?? TEAM[0].id}>
              {TEAM.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Project
            <select
              name="project"
              defaultValue={task?.project ?? "Engineering"}
            >
              {["Engineering", "Operations", "Site works"].map((project) => (
                <option key={project}>{project}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Status
            <select name="status" defaultValue={task?.status ?? initialStatus}>
              {STATUSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select name="priority" defaultValue={task?.priority ?? "Medium"}>
              {["High", "Medium", "Low"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-row">
          <label>
            Scheduled date
            <input
              name="date"
              type="date"
              required
              defaultValue={task?.date ?? initialDate}
            />
          </label>
          <label>
            Time
            <input
              name="time"
              type="time"
              defaultValue={task?.time ?? "09:00"}
            />
          </label>
        </div>
        <footer>
          <span>Saved in this browser’s preview.</span>
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            <Check size={16} />
            {task ? "Save changes" : "Create task"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
