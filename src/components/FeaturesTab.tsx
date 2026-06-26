import {
  Bolt,
  Code,
  Copy,
  Download,
  Eye,
  Globe,
  Layers,
  Monitor,
  Plus,
  Refresh,
  Shield,
  Smartphone,
  Sparkles,
  Tablet,
} from "./icons";

const FEATURES = [
  {
    icon: Bolt,
    title: "Instant Live Preview",
    desc: "Your HTML is rendered the moment it's added — no build step, no waiting, no servers.",
  },
  {
    icon: Shield,
    title: "Sandboxed & Private",
    desc: "Files are read and rendered entirely in your browser. Nothing is ever uploaded anywhere.",
  },
  {
    icon: Monitor,
    title: "Responsive Testing",
    desc: "Switch between desktop, tablet, and mobile widths to see how your layout adapts.",
  },
  {
    icon: Code,
    title: "Full Code Editor",
    desc: "Edit your HTML right in the browser with syntax highlighting, auto-closing tags and live updates.",
  },
  {
    icon: Plus,
    title: "One-Click Insert",
    desc: "Add buttons, sections, images, forms and more instantly — no need to remember the syntax.",
  },
  {
    icon: Refresh,
    title: "Reload & Restore",
    desc: "Refresh the preview anytime, and your last file is remembered between sessions.",
  },
  {
    icon: Download,
    title: "Export Anytime",
    desc: "Download the HTML back to your device or pop it open in a brand-new browser tab.",
  },
  {
    icon: Copy,
    title: "Copy Source",
    desc: "Grab your full HTML at any moment to reuse it in another editor, project, or host.",
  },
  {
    icon: Tablet,
    title: "Any Screen Size",
    desc: "Preview exactly how your page looks and behaves on phone, tablet, and desktop.",
  },
  {
    icon: Sparkles,
    title: "Free AI Assistant",
    desc: "Just describe a change in plain words and the AI rewrites your HTML for you — completely free.",
  },
  {
    icon: Layers,
    title: "Works With Everything",
    desc: "Inline CSS, embedded JavaScript, and external links all run inside the preview.",
  },
  {
    icon: Globe,
    title: "No Setup Required",
    desc: "No accounts, no installs. Drop a file and your site opens — it's that simple.",
  },
];

export default function FeaturesTab() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
          <Eye className="h-4 w-4" /> Everything you need
        </span>
        <h1 className="mt-5 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Edit, preview & AI-build HTML
        </h1>
        <p className="mt-4 text-base text-slate-400 sm:text-lg">
          A focused workspace for viewing any HTML file the way it was meant to
          be seen — fast, private, and fully interactive.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/[0.05]"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 ring-1 ring-white/10">
              <f.icon className="h-6 w-6 text-indigo-300" />
            </span>
            <h3 className="relative mt-4 text-lg font-semibold text-white">
              {f.title}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold text-white">
          Three steps. That's it.
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Add your file",
              desc: "Drag & drop or browse for your .html file — or paste raw markup.",
            },
            {
              n: "02",
              title: "Your site opens",
              desc: "It renders instantly inside the sandboxed preview window.",
            },
            {
              n: "03",
              title: "Inspect & export",
              desc: "Resize, view source, copy, download, or open in a new tab.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="bg-gradient-to-br from-indigo-400 to-violet-500 bg-clip-text text-4xl font-black text-transparent">
                {step.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-slate-500">
        <span className="inline-flex items-center gap-2 text-sm">
          <Shield className="h-5 w-5 text-indigo-400" /> Runs locally
        </span>
        <span className="inline-flex items-center gap-2 text-sm">
          <Smartphone className="h-5 w-5 text-indigo-400" /> Mobile-ready
        </span>
        <span className="inline-flex items-center gap-2 text-sm">
          <Monitor className="h-5 w-5 text-indigo-400" /> Desktop-ready
        </span>
      </div>
    </div>
  );
}
