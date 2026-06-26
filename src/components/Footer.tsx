import { CodeBrackets } from "./icons";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
            <CodeBrackets className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-semibold text-white">
            HTML<span className="text-indigo-400">View</span>
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Preview any HTML file — instantly and privately in your browser.
        </p>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} HTMLView. No data collected.
        </p>
      </div>
    </footer>
  );
}
