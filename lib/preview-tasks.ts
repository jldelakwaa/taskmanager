export const STATUSES = ["To do", "In progress", "Done", "On Hold"] as const;
export type Status = (typeof STATUSES)[number];
export type Priority = "High" | "Medium" | "Low";
export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  project: string;
  date: string;
  time: string;
};

export const TEAM = [
  {
    id: "alex",
    name: "Alex Reyes",
    initials: "AR",
    color: "blue",
    role: "Project engineer",
  },
  {
    id: "mia",
    name: "Mia Santos",
    initials: "MS",
    color: "purple",
    role: "Operations",
  },
  {
    id: "james",
    name: "James Cruz",
    initials: "JC",
    color: "orange",
    role: "Site engineer",
  },
] as const;

// Illustrative tasks for the public preview; no company records are loaded.
export const SAMPLE_TASKS: Task[] = [
  {
    id: "sample-1",
    title: "Review structural drawings",
    description:
      "Check the latest revisions and prepare notes for the coordination meeting.",
    status: "To do",
    priority: "High",
    assignee: "alex",
    project: "Engineering",
    date: "2026-10-15",
    time: "09:00",
  },
  {
    id: "sample-2",
    title: "Prepare weekly progress report",
    description:
      "Bring together site updates, milestones, and outstanding items.",
    status: "To do",
    priority: "Medium",
    assignee: "mia",
    project: "Operations",
    date: "2026-10-16",
    time: "10:00",
  },
  {
    id: "sample-3",
    title: "Update material inventory",
    description:
      "Review available stocks and flag materials needed for next week.",
    status: "To do",
    priority: "Low",
    assignee: "james",
    project: "Site works",
    date: "2026-10-16",
    time: "14:00",
  },
  {
    id: "sample-4",
    title: "Coordinate the site inspection",
    description:
      "Confirm the inspection checklist and coordinate access with the site team.",
    status: "In progress",
    priority: "High",
    assignee: "james",
    project: "Site works",
    date: "2026-10-15",
    time: "10:30",
  },
  {
    id: "sample-5",
    title: "Finalize the project timeline",
    description:
      "Align delivery dates with the team and update the construction schedule.",
    status: "In progress",
    priority: "Medium",
    assignee: "alex",
    project: "Engineering",
    date: "2026-10-15",
    time: "13:00",
  },
  {
    id: "sample-6",
    title: "Submit the purchase request",
    description:
      "Prepare and submit the request for the next delivery of site supplies.",
    status: "Done",
    priority: "Medium",
    assignee: "mia",
    project: "Operations",
    date: "2026-10-15",
    time: "08:30",
  },
  {
    id: "sample-7",
    title: "Complete the safety checklist",
    description:
      "Document the morning safety checks and record any follow-up actions.",
    status: "Done",
    priority: "High",
    assignee: "james",
    project: "Site works",
    date: "2026-10-15",
    time: "08:00",
  },
  {
    id: "sample-8",
    title: "Confirm supplier delivery",
    description:
      "Waiting for the supplier to confirm the delivery window for the remaining materials.",
    status: "On Hold",
    priority: "Medium",
    assignee: "mia",
    project: "Operations",
    date: "2026-10-16",
    time: "11:00",
  },
];

export const STORAGE_KEY = "coliconstruct-task-preview-v1";
const CHANGE_EVENT = "coliconstruct-preview-change";

export function subscribeToTasks(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function readStoredTasks() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function parseTasks(raw: string | null): Task[] {
  if (!raw) return SAMPLE_TASKS;
  try {
    const tasks: unknown = JSON.parse(raw);
    if (
      !Array.isArray(tasks) ||
      !tasks.every(
        (task) =>
          task &&
          typeof task === "object" &&
          [
            "id",
            "title",
            "description",
            "assignee",
            "project",
            "date",
            "time",
          ].every((key) => typeof task[key] === "string") &&
          STATUSES.includes(task.status) &&
          ["High", "Medium", "Low"].includes(task.priority) &&
          TEAM.some((member) => member.id === task.assignee) &&
          /^\d{4}-\d{2}-\d{2}$/.test(task.date),
      )
    )
      return SAMPLE_TASKS;
    return tasks as Task[];
  } catch {
    return SAMPLE_TASKS;
  }
}

export function storeTasks(tasks: Task[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function statusClass(status: Status) {
  return {
    "To do": "todo",
    "In progress": "progress",
    Done: "done",
    "On Hold": "hold",
  }[status];
}

export function displayDate(date: string, today: string) {
  if (date === today) return "Today";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date + "T12:00:00"));
}

export function calendarDays(month: string) {
  const current = new Date(month + "T12:00:00");
  const first = new Date(current.getFullYear(), current.getMonth(), 1, 12);
  const last = new Date(current.getFullYear(), current.getMonth() + 1, 0, 12);
  const total = Math.ceil((first.getDay() + last.getDate()) / 7) * 7;
  return Array.from({ length: total }, (_, index) => {
    const date = new Date(
      first.getFullYear(),
      first.getMonth(),
      index - first.getDay() + 1,
      12,
    );
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return {
      date: iso,
      day: date.getDate(),
      outside: date.getMonth() !== first.getMonth(),
    };
  });
}
