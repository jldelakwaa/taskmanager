"use client";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-950">
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8">
      <h1 className="text-xl font-semibold">Unable to load your workspace</h1>
      <p className="mt-3 text-sm text-slate-600">We could not check your session. Please try again shortly.</p>
      <button onClick={reset} className="mt-6 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Try again</button>
    </section>
  </main>;
}
