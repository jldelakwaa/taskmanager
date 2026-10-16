"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_DIRECTORY,
  DIRECTORY_EVENT,
  DIRECTORY_KEY,
  parseDirectory,
  type Directory,
} from "@/lib/workspace-directory";
import {
  parseTasks,
  readStoredTasks,
  subscribeToTasks,
} from "@/lib/preview-tasks";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DIRECTORY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DIRECTORY_EVENT, callback);
  };
}
function read() {
  try {
    return localStorage.getItem(DIRECTORY_KEY);
  } catch {
    return null;
  }
}
const Context = createContext<{
  directory: Directory;
  saveDirectory: (value: Directory) => boolean;
}>({ directory: DEFAULT_DIRECTORY, saveDirectory: () => false });

export function WorkspaceDataProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const directory = useMemo(() => parseDirectory(raw), [raw]);
  function saveDirectory(value: Directory) {
    try {
      localStorage.setItem(DIRECTORY_KEY, JSON.stringify(value));
      window.dispatchEvent(new Event(DIRECTORY_EVENT));
      return true;
    } catch {
      return false;
    }
  }
  return <Context value={{ directory, saveDirectory }}>{children}</Context>;
}
export function useWorkspaceData() {
  return useContext(Context);
}
export function useWorkspaceTasks() {
  const raw = useSyncExternalStore(
    subscribeToTasks,
    readStoredTasks,
    () => null,
  );
  return useMemo(() => parseTasks(raw), [raw]);
}
