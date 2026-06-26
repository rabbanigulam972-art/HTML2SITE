import { cn } from "../utils/cn";
import { CodeBrackets } from "./icons";

export type TabId = "home" | "features" | "about";

const TABS: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "features", label: "Features" },
  { id: "about", label: "About" },
];

interface NavbarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export default function Navbar({ active, onChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onChange("home")}
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
            <CodeBrackets className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">
            HTML<span className="text-indigo-400">View</span>
          </span>
        </button>

        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors sm:px-5",
                active === tab.id
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {active === tab.id && (
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30" />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </nav>

        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTML"
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 sm:inline-flex"
        >
          HTML Docs
        </a>
      </div>
    </header>
  );
}
