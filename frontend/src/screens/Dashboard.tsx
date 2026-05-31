import { useEffect, useState } from "react";
import { Flame, Plus } from "lucide-react";
import { useI18n } from "../i18n";
import { Button } from "../components/ui";
import { ProjectCard } from "../components/ProjectCard";
import { api } from "../lib/api";
import type { Navigate } from "../App";
import type { Project } from "../types";

export function Dashboard({ onNavigate }: { onNavigate: Navigate }) {
  const { t } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [engineReady, setEngineReady] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const list = await api.listProjects();
    setProjects(
      list.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.raw_idea,
        status: (p.status as Project["status"]) ?? "draft",
      })),
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
    api.getActiveEngine().then((d) => setEngineReady(!!d.active));
  }, []);

  async function remove(id: string) {
    await api.deleteProject(id);
    setProjects((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div className="screen-in">
      <header className="flex items-start gap-5 mb-[30px]">
        <div>
          <h1 className="text-[25px] font-semibold tracking-[-0.022em] text-stone-50">{t("dash_title")}</h1>
          <p className="mt-1.5 text-[14.5px] text-stone-400 max-w-[60ch]">{t("dash_sub")}</p>
        </div>
        <div className="ml-auto shrink-0">
          <Button variant="primary" onClick={() => onNavigate("new-idea")}>
            <Plus size={15} strokeWidth={1.75} />
            {t("new_idea")}
          </Button>
        </div>
      </header>

      {engineReady === false && (
        <button
          onClick={() => onNavigate("engines")}
          className="flex items-center gap-2.5 w-full px-4 py-3 mb-6 rounded-[12px] text-[13.5px] text-ember-300 edge-ember [background:radial-gradient(120%_180%_at_0%_50%,rgba(249,115,22,0.1),transparent_60%),rgba(255,255,255,0.018)]"
        >
          <Flame size={15} /> {t("configure_engine")}
        </button>
      )}

      {!loading && projects.length === 0 ? (
        <div className="flex flex-col items-center text-center py-[70px] px-6 rounded-[18px] edge-soft bg-white/[0.018] screen-in">
          <span className="grid place-items-center w-16 h-16 rounded-2xl text-ember-400 mb-[22px] ember-tile">
            <Flame size={28} />
          </span>
          <h3 className="text-[19px] font-semibold text-stone-50 tracking-[-0.015em]">{t("empty_title")}</h3>
          <p className="mt-2 text-[14px] text-stone-400 max-w-[42ch]">{t("empty_sub")}</p>
          <Button variant="primary" size="lg" className="mt-[22px]" onClick={() => onNavigate("new-idea")}>
            <Plus size={15} strokeWidth={1.75} />
            {t("new_idea_first")}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onWizard={() => onNavigate("wizard", { project: { id: p.id, title: p.title } })}
              onDocs={() => onNavigate("documents", { project: { id: p.id, title: p.title } })}
              onDelete={() => remove(p.id)}
            />
          ))}

          <button
            onClick={() => onNavigate("new-idea")}
            className="flex flex-col items-center justify-center gap-2.5 text-center min-h-[168px] rounded-[14px] border border-dashed border-white/[0.12] bg-white/[0.018] text-stone-400 transition hover:border-ember-500/[0.32] hover:text-ember-300 hover:bg-ember-500/[0.04]"
          >
            <span className="grid place-items-center w-10 h-10 rounded-[11px] text-ember-400 bg-ember-500/[0.08] edge-ember">
              <Plus size={18} strokeWidth={1.75} />
            </span>
            {t("new_idea_card")}
          </button>
        </div>
      )}
    </div>
  );
}
