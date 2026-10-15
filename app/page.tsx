import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  Circle,
  Clock3,
  FileChartColumn,
  LayoutGrid,
  ListTodo,
  MoveRight,
  Pause,
  Sparkles,
  Users,
} from "lucide-react";
import { ProductPreview } from "@/components/product-preview";
import { MarketingHeader } from "@/components/marketing-header";
import { MarketingTheme } from "@/components/marketing-theme";
import "./marketing.css";

export const metadata: Metadata = {
  title: "Coliconstruct Task Manager | A clearer way to work",
  description:
    "Bring tasks, schedules, and daily task reports into one clear workspace. Explore the Coliconstruct Task Manager product preview.",
};

const questions = [
  {
    question: "Who is this workspace for?",
    answer:
      "We’re building Task Manager for the Coliconstruct team first, with a focus on clear task ownership, shared schedules, and everyday coordination. A public version is part of the longer-term plan.",
  },
  {
    question: "Can I switch between different task views?",
    answer:
      "Yes. The workspace preview includes board, table, and monthly calendar views of the same tasks. Change a task in one view and the update appears in the others.",
  },
  {
    question: "What does a daily report show?",
    answer:
      "Choose a date and a team member to see tasks scheduled for that day and their current statuses. You can also view everyone together for a team-wide picture.",
  },
  {
    question: "Can I try it before the public launch?",
    answer:
      "You can explore the interactive preview now with illustrative tasks and team members. Preview changes stay in your browser. External account access and public launch details will be announced as the product develops.",
  },
];

export default function Home() {
  return (
    <MarketingTheme>
      <a className="marketing-skip" href="#main">
        Skip to content
      </a>
      <MarketingHeader />
      <main id="main">
        <section className="marketing-hero">
          <div className="marketing-container marketing-hero-grid">
            <div className="marketing-hero-copy">
              <div className="marketing-eyebrow">
                <span />
                BUILT FOR COLICONSTRUCT. MADE FOR TEAMWORK.
              </div>
              <h1>
                Good work starts with <span>a clear plan.</span>
              </h1>
              <p>
                Give every task an owner, every day a plan, and your team a
                shared view of what comes next.
              </p>
              <div className="marketing-hero-actions">
                <Link href="/preview" className="marketing-button">
                  Explore the workspace <ArrowRight size={17} />
                </Link>
                <a className="marketing-text-link" href="#workflow">
                  See how it works{" "}
                  <span>
                    <ArrowDownIcon />
                  </span>
                </a>
              </div>
              <div className="marketing-hero-note">
                <span className="marketing-note-icon">
                  <Check size={12} />
                </span>
                Thoughtfully built for the everyday work of a team.
              </div>
            </div>
            <div className="marketing-hero-visual">
              <div className="marketing-visual-orbit orbit-one" />
              <div className="marketing-visual-orbit orbit-two" />
              <ProductPreview />
              <div className="marketing-floating-note">
                <span>
                  <CheckCheck size={17} />
                </span>
                <div>
                  <strong>A little more clarity.</strong>
                  <small>A lot more progress.</small>
                </div>
                <Sparkles size={16} />
              </div>
            </div>
          </div>
          <div className="marketing-container marketing-values">
            <span>
              ONE WORKSPACE.
              <br />
              <strong>A MORE CONNECTED TEAM.</strong>
            </span>
            <div>
              <LayoutGrid size={17} />
              <span>Tasks that move with you</span>
            </div>
            <div>
              <CalendarDays size={17} />
              <span>Plans you can see</span>
            </div>
            <div>
              <FileChartColumn size={17} />
              <span>A clearer daily picture</span>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="marketing-features marketing-container"
        >
          <div className="marketing-section-heading">
            <div className="marketing-eyebrow">
              A PLACE FOR THE WHOLE PICTURE
            </div>
            <h2>
              Less scattered.
              <br />
              <span>More together.</span>
            </h2>
            <p>
              Your work has different moving parts.
              <br />
              Give them a place to come together.
            </p>
          </div>
          <div className="marketing-feature-grid">
            <article className="marketing-feature-card">
              <div className="marketing-feature-icon">
                <LayoutGrid size={23} />
              </div>
              <h3>See work your way.</h3>
              <p>
                Move between board, table, and calendar views. Keep the same
                tasks in sight, in the format that makes sense for you.
              </p>
              <div className="marketing-view-pills">
                <span>
                  <LayoutGrid size={12} />
                  Board
                </span>
                <span>
                  <ListTodo size={12} />
                  Table
                </span>
                <span>
                  <CalendarDays size={12} />
                  Calendar
                </span>
              </div>
            </article>
            <article className="marketing-feature-card">
              <div className="marketing-feature-icon">
                <CalendarDays size={23} />
              </div>
              <h3>Make a little room to plan.</h3>
              <p>
                Put tasks on the calendar with a scheduled date and time. See
                how the week fits together before it fills up.
              </p>
              <div className="marketing-week-strip" aria-hidden="true">
                {["M", "T", "W", "T", "F"].map((day, index) => (
                  <span className={index === 3 ? "highlight" : ""} key={index}>
                    {day}
                    <strong>{12 + index}</strong>
                    <i />
                  </span>
                ))}
              </div>
            </article>
            <article className="marketing-feature-card">
              <div className="marketing-feature-icon">
                <Users size={23} />
              </div>
              <h3>Know who’s doing what.</h3>
              <p>
                Give tasks an owner and a priority. Filter the workspace by team
                member so everyone can focus on their part.
              </p>
              <div className="marketing-people">
                <span>AR</span>
                <span>MS</span>
                <span>JC</span>
                <small>Shared goals. Clear ownership.</small>
              </div>
            </article>
          </div>
        </section>

        <section className="marketing-report-section">
          <div className="marketing-container marketing-report-grid">
            <div
              className="marketing-report-illustration"
              aria-label="Sample daily task report"
            >
              <div className="report-illustration-top">
                <span className="report-illustration-icon">
                  <FileChartColumn size={22} />
                </span>
                <div>
                  <strong>A day at a glance</strong>
                  <span>Illustrative daily report</span>
                </div>
                <span className="report-day-label">OCT 15</span>
              </div>
              <div className="report-person">
                <span className="report-person-avatar">JC</span>
                <div>
                  <strong>James Cruz</strong>
                  <span>Site engineer</span>
                </div>
                <span className="report-person-count">2 tasks</span>
              </div>
              <div className="report-illustration-task">
                <span className="report-task-tick">
                  <Check size={12} />
                </span>
                <div>
                  <strong>Complete the safety checklist</strong>
                  <span>08:00 · Site works</span>
                </div>
                <span className="report-done">Done</span>
              </div>
              <div className="report-illustration-task">
                <span className="report-task-clock">
                  <Clock3 size={13} />
                </span>
                <div>
                  <strong>Coordinate the site inspection</strong>
                  <span>10:30 · Site works</span>
                </div>
                <span className="report-inprogress">In progress</span>
              </div>
              <div className="report-illustration-footer">
                <CalendarDays size={13} />
                One date. One team. A shared picture.
                <span />
              </div>
            </div>
            <div className="marketing-report-copy">
              <div className="marketing-eyebrow">EVERY DAY HAS A STORY</div>
              <h2>
                See the day.
                <br />
                <span>Understand the work.</span>
              </h2>
              <p>
                A focused daily report brings each person’s scheduled tasks and
                current statuses together. Choose a date, choose a team member,
                and see what’s on their plate.
              </p>
              <ul>
                <li>
                  <Check size={14} />A view for one person or the whole team
                </li>
                <li>
                  <Check size={14} />
                  Tasks grouped by the day they’re scheduled
                </li>
                <li>
                  <Check size={14} />
                  Clear statuses that show where work stands
                </li>
              </ul>
              <Link className="marketing-inline-link" href="/preview">
                Take a closer look <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="marketing-workflow marketing-container"
        >
          <div className="marketing-section-heading centered">
            <div className="marketing-eyebrow">
              SIMPLE STEPS. SHARED PROGRESS.
            </div>
            <h2>
              A task. A plan.
              <br />
              <span>A way forward.</span>
            </h2>
            <p>Build a rhythm your team can follow.</p>
          </div>
          <div className="marketing-steps">
            {[
              {
                number: "01",
                icon: ListTodo,
                title: "Capture the work.",
                text: "Add a task, give it a little context, and decide what matters most.",
              },
              {
                number: "02",
                icon: CalendarDays,
                title: "Give it a place.",
                text: "Assign an owner and schedule a date, so everyone knows what comes next.",
              },
              {
                number: "03",
                icon: CheckCheck,
                title: "Keep it moving.",
                text: "Update the status as work progresses, then see the day’s tasks in the daily report.",
              },
            ].map((step) => (
              <article key={step.number}>
                <div className="marketing-step-top">
                  <span>{step.number}</span>
                  <step.icon size={21} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div
            className="marketing-status-path"
            aria-label="Available task statuses"
          >
            <span>
              <Circle size={13} />
              To do
            </span>
            <MoveRight size={16} />
            <span>
              <Clock3 size={13} />
              In progress
            </span>
            <MoveRight size={16} />
            <span>
              <CheckCheck size={13} />
              Done
            </span>
            <span className="marketing-path-hold">
              <Pause size={12} />
              On Hold, when you need a pause
            </span>
          </div>
        </section>

        <section id="questions" className="marketing-faq marketing-container">
          <div>
            <div className="marketing-eyebrow">A FEW THINGS TO KNOW</div>
            <h2>
              Good questions.
              <br />
              <span>Clear answers.</span>
            </h2>
            <p>
              We’re building with our team today,
              <br />
              and looking ahead to what’s next.
            </p>
          </div>
          <div className="marketing-faq-list">
            {questions.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <ChevronDown size={17} />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="marketing-cta marketing-container">
          <div className="marketing-cta-content">
            <div className="marketing-eyebrow">
              <span />
              YOUR NEXT STEP
            </div>
            <h2>A clearer day starts here.</h2>
            <p>Take a look around. See how your work could fit together.</p>
            <Link href="/preview" className="marketing-button light">
              Explore the workspace <ArrowRight size={17} />
            </Link>
            <Link href="/sign-in" className="marketing-cta-signin">
              Sign In <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="marketing-cta-art" aria-hidden="true">
            <div>
              <CheckCheck size={45} />
            </div>
            <i />
            <i />
            <i />
          </div>
        </section>
      </main>
      <footer className="marketing-footer marketing-container">
        <div>
          <Link
            className="marketing-brand"
            href="/"
            aria-label="Coliconstruct home"
          >
            <Image
              src="/brand/coliconstruct-logo.png"
              alt="Coliconstruct Engineering Services"
              width={2135}
              height={736}
            />
          </Link>
          <p>A Coliconstruct workspace. Thoughtfully in progress.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#features">Features</a>
          <Link href="/preview">Workspace preview</Link>
          <Link href="/sign-in">Sign In</Link>
        </nav>
        <span>© 2026 Coliconstruct</span>
      </footer>
    </MarketingTheme>
  );
}

function ArrowDownIcon() {
  return <ArrowRight size={13} className="marketing-down-arrow" />;
}
