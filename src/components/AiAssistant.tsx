import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { editHtmlWithAI, localFallback } from "./aiService";
import {
  Check,
  Code,
  ExternalLink,
  Loader,
  Refresh,
  Send,
  Shield,
  Sparkles,
  Wand,
  X,
} from "./icons";

interface AiAssistantProps {
  open: boolean;
  currentHtml: string;
  onClose: () => void;
  onApply: (html: string) => void;
}

const SUGGESTIONS = [
  "Make a dark theme",
  "Add a sticky navigation bar",
  "Center everything",
  "Add a contact form",
  "Make it fully responsive",
  "Add a hero section",
  "Change colors to blue and white",
  "Add a footer with social links",
];

type Status = "idle" | "loading" | "done" | "error";

export default function AiAssistant({
  open,
  currentHtml,
  onClose,
  onApply,
}: AiAssistantProps) {
  const [instruction, setInstruction] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [usedFallback, setUsedFallback] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setResult("");
      setError("");
      setUsedFallback(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  // Live preview blob for the generated result
  const [previewUrl, setPreviewUrl] = useState("");
  useEffect(() => {
    if (!result) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(
      new Blob([result], { type: "text/html;charset=utf-8" })
    );
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [result]);

  const run = async (text?: string) => {
    const request = (text ?? instruction).trim();
    if (!request || status === "loading") return;
    setInstruction(request);
    setStatus("loading");
    setError("");
    setResult("");
    setUsedFallback(false);
    try {
      const html = await editHtmlWithAI(currentHtml, request);
      setResult(html);
      setStatus("done");
      setTab("preview");
    } catch (e) {
      // Graceful offline fallback for common tweaks
      try {
        const fb = localFallback(currentHtml, request);
        setResult(fb);
        setUsedFallback(true);
        setStatus("done");
        setTab("preview");
      } catch {
        setError(
          e instanceof Error ? e.message : "Something went wrong. Please try again."
        );
        setStatus("error");
      }
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApply(result);
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      run();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-600 shadow-lg shadow-fuchsia-500/30">
              <Wand className="h-5 w-5 text-white" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">AI Assistant</h2>
              <p className="text-[11px] text-slate-400">
                Describe a change — the AI edits your HTML
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Prompt area */}
        <div className="border-b border-white/10 bg-white/[0.02] p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                onKeyDown={handleKey}
                rows={2}
                placeholder={
                  currentHtml.trim()
                    ? "e.g. Add a red call-to-action button, make the heading bigger…"
                    : "e.g. Create a landing page for a coffee shop…"
                }
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-fuchsia-400/60"
              />
            </div>
            <button
              onClick={() => run()}
              disabled={!instruction.trim() || status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "loading" ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {status === "loading" ? "Thinking…" : "Generate"}
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => run(s)}
                disabled={status === "loading"}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10 hover:text-white disabled:opacity-40"
              >
                <Sparkles className="h-3 w-3 text-fuchsia-300" />
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Result / states */}
        <div className="min-h-[260px] flex-1 overflow-hidden bg-slate-950/40">
          {status === "idle" && (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-indigo-600/20 ring-1 ring-white/10">
                <Wand className="h-7 w-7 text-fuchsia-300" />
              </span>
              <p className="max-w-sm text-sm text-slate-400">
                Tell the AI what to change, or pick a suggestion above. It will
                rewrite your HTML and show a live preview here before you apply
                it.
              </p>
            </div>
          )}

          {status === "loading" && (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <Loader className="h-8 w-8 animate-spin text-fuchsia-400" />
              <p className="text-sm text-slate-300">
                The AI is {currentHtml.trim() ? "editing" : "creating"} your page…
              </p>
              <p className="text-xs text-slate-500">This can take 10–20 seconds.</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
              <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">
                {error}
              </p>
              <button
                onClick={() => run()}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                Try again
              </button>
            </div>
          )}

          {status === "done" && result && (
            <div className="flex h-full flex-col">
              {usedFallback && (
                <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-300">
                  The AI service was unavailable, so a built-in quick fix was
                  applied. Press Generate again to retry the full AI.
                </div>
              )}
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
                  <Seg active={tab === "preview"} onClick={() => setTab("preview")}>
                    <ExternalLink className="h-3.5 w-3.5" /> Preview
                  </Seg>
                  <Seg active={tab === "code"} onClick={() => setTab("code")}>
                    <Code className="h-3.5 w-3.5" /> Code
                  </Seg>
                </div>
                <span className="text-[11px] text-slate-500">
                  {(result.length / 1024).toFixed(1)} KB generated
                </span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                {tab === "preview" ? (
                  <iframe
                    title="AI preview"
                    src={previewUrl}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    className="h-full min-h-[300px] w-full bg-white"
                  />
                ) : (
                  <pre className="max-h-[50vh] overflow-auto p-4 text-left text-xs leading-relaxed text-slate-300">
                    <code>{result}</code>
                  </pre>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-white/[0.02] p-3">
                <button
                  onClick={() => run()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
                >
                  <Refresh className="h-3.5 w-3.5" /> Regenerate
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleApply}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90"
                  >
                    <Check className="h-4 w-4" /> Apply to editor
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer disclaimer */}
        <div className="flex items-center gap-2 border-t border-white/10 bg-slate-950 px-4 py-2 text-[11px] text-slate-500">
          <Shield className="h-3.5 w-3.5 shrink-0 text-slate-600" />
          <span>
            Powered by the free Pollinations AI. Your HTML is sent to it to be
            processed — nothing is stored.
          </span>
        </div>
      </div>
    </div>
  );
}

function Seg({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-white shadow"
          : "text-slate-400 hover:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}
