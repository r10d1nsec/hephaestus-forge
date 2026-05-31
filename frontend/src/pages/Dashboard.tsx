import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, FileText, Trash2, Flame } from "lucide-react";
import { api, Project } from "../lib/api";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [engineReady, setEngineReady] = useState<boolean | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    api.listProjects().then(setProjects);
    api.getActiveEngine().then((d) => setEngineReady(!!d.active));
  }, []);

  async function remove(id: string) {
    await api.deleteProject(id);
    setProjects((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-50">Tus proyectos</h1>
          <p className="mt-1 text-sm text-forge-steel">
            Forja una idea difusa en una especificación lista para construir.
          </p>
        </div>
        <button
          onClick={() => nav("/new")}
          className="ember-glow flex items-center gap-2 rounded-lg bg-forge-ember px-4 py-2 font-medium text-stone-950"
        >
          <Plus size={18} /> Nueva idea
        </button>
      </div>

      {engineReady === false && (
        <Link
          to="/settings"
          className="mt-6 flex items-center gap-2 rounded-lg border border-forge-ember/40 bg-forge-ember/10 px-4 py-3 text-sm text-forge-ember-soft"
        >
          <Flame size={16} /> Configura un engine antes de empezar →
        </Link>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className="group rounded-xl border border-forge-border bg-forge-panel p-5 transition hover:border-forge-ember/50"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-stone-100">{p.title}</h3>
              <button onClick={() => remove(p.id)} className="text-stone-600 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-forge-steel">{p.raw_idea}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full bg-forge-border px-2 py-0.5 text-xs text-forge-steel">
                {p.status}
              </span>
              <div className="flex gap-3 text-sm">
                <Link to={`/project/${p.id}/wizard`} className="text-forge-ember-soft hover:underline">
                  Wizard
                </Link>
                <Link
                  to={`/project/${p.id}/documents`}
                  className="flex items-center gap-1 text-forge-steel hover:text-stone-100"
                >
                  <FileText size={14} /> Docs
                </Link>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-forge-border py-16 text-center text-forge-steel">
            Aún no hay proyectos. Pulsa <span className="text-forge-ember-soft">Nueva idea</span> para empezar.
          </div>
        )}
      </div>
    </div>
  );
}
