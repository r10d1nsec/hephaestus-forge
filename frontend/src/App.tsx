import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Flame, LayoutDashboard, Settings as SettingsIcon } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import NewIdea from "./pages/NewIdea";
import Wizard from "./pages/Wizard";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-forge-ember/15 text-forge-ember-soft"
          : "text-forge-steel hover:bg-forge-border/60 hover:text-stone-100"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function App() {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-col gap-1 border-r border-forge-border bg-forge-panel p-4">
        <Link to="/" className="mb-6 flex items-center gap-2 px-1">
          <Flame className="text-forge-ember" size={26} />
          <span className="text-lg font-bold tracking-tight text-stone-50">
            Hephaestus<span className="text-forge-ember">'</span> Forge
          </span>
        </Link>
        <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem to="/settings" icon={<SettingsIcon size={18} />} label="Engines" />
        <div className="mt-auto px-1 text-xs text-forge-steel/70">
          v0.1.0 · 100% local
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewIdea />} />
          <Route path="/project/:id/wizard" element={<Wizard />} />
          <Route path="/project/:id/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
