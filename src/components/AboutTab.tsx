import { CodeBrackets, Heart, Shield, Sparkles } from "./icons";
import type { TabId } from "./Navbar";

interface AboutTabProps {
  onNavigate: (tab: TabId) => void;
}

export default function AboutTab({ onNavigate }: AboutTabProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
          <Sparkles className="h-4 w-4" /> About
        </span>
        <h1 className="mt-5 flex items-center justify-center gap-3 text-4xl font-bold tracking-tight text-white">
          HTML<span className="text-indigo-400">View</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
          The fastest way to open and preview any HTML file. Add it on the Home
          tab and watch your site come to life instantly.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Sparkles}
          title="What it does"
          body="HTMLView reads your HTML file directly in the browser and renders it in a sandboxed preview, exactly as a real browser would."
        />
        <InfoCard
          icon={Shield}
          title="Privacy first"
          body="There are no servers. Your file never leaves your device — it's processed locally and remembered only in your browser storage."
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <CodeBrackets className="h-5 w-5 text-indigo-400" /> Good to know
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-400">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            Inline CSS and embedded JavaScript run inside the preview, so
            interactive sites work as expected.
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            For best results, use self-contained HTML files. External assets
            with relative paths may not resolve in the sandbox.
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            Use the device toggle to check your layout across screen sizes.
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
            Not sure how to write something? Open the AI Assistant and describe it
            in plain words — it writes the HTML for you.
          </li>
        </ul>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          onClick={() => onNavigate("home")}
          className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105"
        >
          Go to Home & open my HTML
        </button>
        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          Built with <Heart className="h-4 w-4 text-rose-400" /> for makers,
          learners, and tinkerers.
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Shield;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 ring-1 ring-white/10">
        <Icon className="h-5 w-5 text-indigo-300" />
      </span>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}
