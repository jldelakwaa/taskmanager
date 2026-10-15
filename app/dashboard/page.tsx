import { requireSession } from "@/lib/session";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const { user } = await requireSession();

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <span className="font-semibold">Task Manager</span>
          <SignOutButton />
        </header>
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8">
          <p className="text-sm font-medium text-indigo-600">Your workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome, {user.name}</h1>
          <p className="mt-3 text-slate-600">You are signed in as {user.email}.</p>
          <p className="mt-6 text-sm text-slate-500">Your task board, calendar, and daily reports will appear here as we build your workspace.</p>
        </section>
      </div>
    </main>
  );
}
