import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { cn } from "../utils/cn";
import CodeEditor from "./CodeEditor";
import AiAssistant from "./AiAssistant";
import { SNIPPETS } from "./snippets";
import {
  Bolt,
  Check,
  Code,
  Columns,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  Monitor,
  Plus,
  Refresh,
  Shield,
  Smartphone,
  Tablet,
  Trash,
  UploadCloud,
  Wand,
  X,
} from "./icons";

type Device = "desktop" | "tablet" | "mobile";
type View = "split" | "edit" | "preview";

const DEVICE_WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const STORAGE_KEY = "htmlview:last-html";
const NAME_KEY = "htmlview:last-name";

const BLANK_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>Edit me — or click a button above to add a section, image, or button.</p>
    
  </body>
</html>`;

export default function HomeTab() {
  const [html, setHtml] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const [device, setDevice] = useState<Device>("desktop");
  const [view, setView] = useState<View>("split");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [aiOpen, setAiOpen] = useState(false);

  const editorRef = useRef<ReactCodeMirrorRef>(null);

  // Restore last session
  useEffect(() => {
    const savedHtml = localStorage.getItem(STORAGE_KEY);
    const savedName = localStorage.getItem(NAME_KEY);
    if (savedHtml) {
      setHtml(savedHtml);
      setLive(savedHtml);
      setFileName(savedName || "restored.html");
    }
  }, []);

  // Debounce preview updates while editing
  useEffect(() => {
    if (html == null) return;
    const t = setTimeout(() => setLive(html), 350);
    return () => clearTimeout(t);
  }, [html]);

  // Build / tear down a blob URL whenever the (debounced) HTML changes
  useEffect(() => {
    if (!live) {
      setBlobUrl("");
      return;
    }
    const blob = new Blob([live], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    setIframeKey((k) => k + 1);
    return () => URL.revokeObjectURL(url);
  }, [live]);

  const persist = useCallback((value: string, name: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    localStorage.setItem(NAME_KEY, name);
  }, []);

  // Apply AI-generated HTML, keeping the current file name
  const applyAiResult = useCallback(
    (value: string) => {
      const name = fileName || "ai-edited.html";
      setHtml(value);
      setLive(value);
      setFileName(name);
      persist(value, name);
      setView("split");
    },
    [fileName, persist]
  );

  const loadContent = useCallback(
    (text: string, name: string) => {
      if (text.length > 5_000_000) {
        setError("That file is very large (over 5MB) and may run slowly.");
      } else {
        setError("");
      }
      setHtml(text);
      setLive(text);
      setFileName(name);
      persist(text, name);
      setView("split");
    },
    [persist]
  );

  const loadFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return;
      const ok =
        file.type === "text/html" || /\.(html?|xht(ml)?|svg)$/i.test(file.name);
      if (!ok) setError("That doesn't look like an HTML file, but we'll try anyway.");
      try {
        const text = await file.text();
        loadContent(text, file.name);
      } catch {
        setError("Sorry, we couldn't read that file. Try another one.");
      }
    },
    [loadContent]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      loadFile(e.dataTransfer.files?.[0]);
    },
    [loadFile]
  );

  // Insert an HTML snippet at the cursor in the editor
  const insertSnippet = useCallback((code: string) => {
    const viewRef = editorRef.current?.view;
    if (viewRef) {
      const sel = viewRef.state.selection.main;
      viewRef.dispatch({
        changes: { from: sel.from, to: sel.to, insert: code },
        selection: { anchor: sel.from + code.length },
        scrollIntoView: true,
      });
      viewRef.focus();
    } else {
      // Fallback: append to the end
      setHtml((prev) => `${prev ?? ""}${code}`);
    }
    setView((v) => (v === "preview" ? "split" : v));
  }, []);

  const handleCopy = async () => {
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Couldn't copy to clipboard.");
    }
  };

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "site.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setHtml(null);
    setLive("");
    setFileName("");
    setError("");
    setPasteValue("");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NAME_KEY);
  };

  const submitPaste = () => {
    if (!pasteValue.trim()) return;
    loadContent(pasteValue, "pasted-snippet.html");
    setPasteValue("");
    setPasteOpen(false);
  };

  const startBlank = () => loadContent(BLANK_TEMPLATE, "untitled.html");

  const refresh = () => setIframeKey((k) => k + 1);

  // -------- Empty state --------
  if (!html) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-5xl">
            Add or edit your HTML
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-400 sm:text-lg">
            Drop in an existing HTML file or start from scratch — then edit it
            live and add buttons, sections, and more with one click.
          </p>
        </div>

        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={cn(
            "group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-16 text-center transition-all",
            dragActive
              ? "scale-[1.01] border-indigo-400 bg-indigo-500/10"
              : "border-white/15 bg-white/[0.03] hover:border-indigo-400/60 hover:bg-white/[0.05]"
          )}
        >
          <input
            type="file"
            accept=".html,.htm,.xhtml,.xht,.svg,text/html"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />
          <span
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30 transition-transform",
              dragActive ? "scale-110" : "group-hover:scale-105"
            )}
          >
            <UploadCloud className="h-8 w-8 text-white" />
          </span>
          <span className="mt-6 text-lg font-semibold text-white">
            {dragActive ? "Release to load your file" : "Drag & drop your HTML file"}
          </span>
          <span className="mt-1.5 text-sm text-slate-400">
            or <span className="font-medium text-indigo-400">browse your device</span> — .html, .htm, .svg
          </span>
        </label>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setAiOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-transform hover:scale-105"
          >
            <Wand className="h-4 w-4" /> Generate with AI
          </button>
          <button
            onClick={startBlank}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            <Plus className="h-4 w-4" /> Blank page
          </button>
          <button
            onClick={() => setPasteOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            <Code className="h-4 w-4" /> Paste HTML
          </button>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-amber-400">{error}</p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Shield, title: "Sandboxed", desc: "Runs in isolation, never stored on a server." },
            { icon: Bolt, title: "Live editing", desc: "Your preview updates as you type." },
            { icon: Plus, title: "Insert blocks", desc: "Add buttons, sections & more with one click." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <f.icon className="h-6 w-6 text-indigo-400" />
              <h3 className="mt-3 font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>

        {pasteOpen && (
          <PasteModal
            value={pasteValue}
            onChange={setPasteValue}
            onCancel={() => setPasteOpen(false)}
            onSubmit={submitPaste}
          />
        )}

        <AiAssistant
          open={aiOpen}
          currentHtml=""
          onClose={() => setAiOpen(false)}
          onApply={applyAiResult}
        />
      </div>
    );
  }

  // -------- Editor workspace --------
  const showEditor = view !== "preview";
  const showPreview = view !== "edit";

  return (
    <div className="mx-auto max-w-[100rem] px-3 py-4 sm:px-6 lg:px-8">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
            <FileCode className="h-5 w-5 text-white" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{fileName}</p>
            <p className="text-xs text-slate-400">
              {(html.length / 1024).toFixed(1)} KB · live editor
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAiOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition-opacity hover:opacity-90"
          >
            <Wand className="h-4 w-4" /> AI Assistant
          </button>

          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
            <SegmentButton active={view === "split"} onClick={() => setView("split")}>
              <Columns className="h-4 w-4" /> Split
            </SegmentButton>
            <SegmentButton active={view === "edit"} onClick={() => setView("edit")}>
              <Code className="h-4 w-4" /> Edit
            </SegmentButton>
            <SegmentButton active={view === "preview"} onClick={() => setView("preview")}>
              <ExternalLink className="h-4 w-4" /> Preview
            </SegmentButton>
          </div>

          {/* Device toggle */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
            <IconButton active={device === "desktop"} onClick={() => setDevice("desktop")} title="Desktop">
              <Monitor className="h-4 w-4" />
            </IconButton>
            <IconButton active={device === "tablet"} onClick={() => setDevice("tablet")} title="Tablet">
              <Tablet className="h-4 w-4" />
            </IconButton>
            <IconButton active={device === "mobile"} onClick={() => setDevice("mobile")} title="Mobile">
              <Smartphone className="h-4 w-4" />
            </IconButton>
          </div>

          <ToolButton onClick={refresh} title="Reload preview">
            <Refresh className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={handleCopy} title="Copy source">
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </ToolButton>
          <ToolButton onClick={handleDownload} title="Download HTML">
            <Download className="h-4 w-4" />
          </ToolButton>
          <ToolButton
            onClick={() => blobUrl && window.open(blobUrl, "_blank")}
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={handleClear} title="Remove file" danger>
            <Trash className="h-4 w-4" />
          </ToolButton>
        </div>
      </div>

      {/* Insert palette */}
      {showEditor && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
          <div className="mb-2 flex items-center gap-2 px-1.5">
            <Plus className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Insert element — drops it at your cursor
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SNIPPETS.map((s) => (
              <button
                key={s.id}
                onClick={() => insertSnippet(s.code)}
                title={`Insert ${s.label}`}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-white"
              >
                <s.icon className="h-4 w-4 text-indigo-300" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-amber-400">{error}</p>}

      {/* Workspace */}
      <div
        className={cn(
          "mt-3 gap-3",
          showEditor && showPreview ? "grid lg:grid-cols-2" : "flex"
        )}
      >
        {showEditor && (
          <div className="flex h-[60vh] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#282a36] lg:h-[72vh]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Code className="h-4 w-4 text-indigo-400" /> editor.html
              </span>
              <span className="text-[11px] text-slate-500">auto-closing tags · live</span>
            </div>
            <div className="min-h-0 flex-1 overflow-auto text-left">
              <CodeEditor
                ref={editorRef}
                value={html}
                onChange={(v) => {
                  setHtml(v);
                  persist(v, fileName);
                }}
              />
            </div>
          </div>
        )}

        {showPreview && (
          <div className="flex h-[60vh] justify-center lg:h-[72vh]">
            <div
              className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl"
              style={{ maxWidth: DEVICE_WIDTH[device] }}
            >
              <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 truncate rounded-md bg-white px-3 py-0.5 text-xs text-slate-500">
                  {fileName}
                </span>
              </div>
              <iframe
                key={iframeKey}
                title="HTML preview"
                src={blobUrl}
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                className="h-[calc(100%-38px)] w-full bg-white"
              />
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-slate-500">
        Type to edit and watch the preview update. Click an insert button to add a
        block where your cursor is — your work is saved automatically.
      </p>

      <AiAssistant
        open={aiOpen}
        currentHtml={html ?? ""}
        onClose={() => setAiOpen(false)}
        onApply={applyAiResult}
      />
    </div>
  );
}

function SegmentButton({
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
          ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow"
          : "text-slate-400 hover:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}

function IconButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        active ? "bg-white/10 text-indigo-300" : "text-slate-400 hover:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}

function ToolButton({
  onClick,
  title,
  danger,
  children,
}: {
  onClick: () => void;
  title: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white",
        danger && "hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
      )}
    >
      {children}
    </button>
  );
}

function PasteModal({
  value,
  onChange,
  onCancel,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Code className="h-5 w-5 text-indigo-400" /> Paste your HTML
          </h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={"<!DOCTYPE html>\n<html>\n  ...paste your markup here... \n</html>"}
          rows={12}
          className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-indigo-400/60"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90"
          >
            Open in editor
          </button>
        </div>
      </div>
    </div>
  );
}
