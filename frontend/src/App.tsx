import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Flame, LayoutDashboard, Languages, Settings as SettingsIcon } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import NewIdea from "./pages/NewIdea";
import Wizard from "./pages/Wizard";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import { useT } from "./i18n/useT";
import { LANGS, LANG_LABELS, Lang } from "./i18n";

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
  const { t, lang, setLang } = useT();
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-col gap-1 border-r border-forge-border bg-forge-panel p-4">
        <Link to="/" className="mb-6 flex items-center gap-2 px-1">
          <Flame className="text-forge-ember" size={26} />
          <span className="text-lg font-bold tracking-tight text-stone-50">
            Hephaestus<span className="text-forge-ember">'</span> Forge
          </span>
        </Link>
        <NavItem to="/" icon={<LayoutDashboard size={18} />} label={t("nav.dashboard")} />
        <NavItem to="/settings" icon={<SettingsIcon size={18} />} label={t("nav.engines")} />
        <div className="mt-auto flex flex-col gap-3 px-1">
          <label className="flex items-center gap-2 text-xs text-forge-steel">
            <Languages size={15} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="flex-1 rounded-md border border-forge-border bg-forge-bg px-2 py-1 text-stone-200"
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>{LANG_LABELS[l]}</option>
              ))}
            </select>
          </label>
          <span className="text-xs text-forge-steel/70">v0.1.0 · {t("nav.local")}</span>
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
