import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand, Sidebar } from "./components/Sidebar";
import { Dashboard } from "./screens/Dashboard";
import { NewIdea } from "./screens/NewIdea";
import { Wizard } from "./screens/Wizard";
import { Documents } from "./screens/Documents";
import { Engines } from "./screens/Engines";
import { cn } from "./lib/cn";
import type { Screen } from "./types";

export interface ActiveProject {
  id: string;
  title: string;
}

export interface NavOptions {
  project?: ActiveProject;
  generate?: boolean;
}

export type Navigate = (s: Screen, opts?: NavOptions) => void;

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [project, setProject] = useState<ActiveProject | null>(null);
  const [generateOnEnter, setGenerateOnEnter] = useState(false);

  const go: Navigate = (s, opts) => {
    if (opts?.project) setProject(opts.project);
    setGenerateOnEnter(!!opts?.generate);
    setScreen(s);
    setNavOpen(false);
  };

  return (
    <div className="md:grid md:grid-cols-[248px_1fr] min-h-screen">
      {/* mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center gap-3 h-14 px-4 bg-bg/80 backdrop-blur border-b border-white/[0.07]">
        <button
          aria-label="Menu"
          onClick={() => setNavOpen((v) => !v)}
          className="grid place-items-center w-9 h-9 rounded-lg text-stone-300 edge"
        >
          {navOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Brand />
      </div>

      {/* sidebar — off-canvas under md */}
      <div
        className={cn(
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-[248px] max-md:transition-transform",
          navOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        )}
      >
        <Sidebar active={screen} onNavigate={go} />
      </div>

      {/* scrim */}
      {navOpen && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setNavOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/50"
        />
      )}

      {/* main */}
      <main className="min-w-0">
        <div className="min-h-screen px-[clamp(20px,5vw,64px)] pt-10 pb-20 max-w-[1180px] mx-auto">
          {screen === "dashboard" && <Dashboard onNavigate={go} />}
          {screen === "new-idea" && <NewIdea onNavigate={go} />}
          {screen === "wizard" && <Wizard onNavigate={go} project={project} />}
          {screen === "documents" && <Documents project={project} autoGenerate={generateOnEnter} />}
          {screen === "engines" && <Engines />}
        </div>
      </main>
    </div>
  );
}
