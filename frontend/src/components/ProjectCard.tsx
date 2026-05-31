import { FileText, Flame, Trash2, Wand2 } from "lucide-react";
import { useI18n } from "../i18n";
import { Badge } from "./ui";
import type { Project } from "../types";

export function ProjectCard({
  project,
  onWizard,
  onDocs,
  onDelete,
}: {
  project: Project;
  onWizard: () => void;
  onDocs: () => void;
  onDelete: () => void;
}) {
  const { t } = useI18n();
  const complete = project.status === "complete";
  return (
    <article className="group relative overflow-hidden p-5 rounded-[14px] edge bg-gradient-to-b from-white/[0.032] to-white/[0.018] transition hover:-translate-y-[3px] hover:border-ember-500/[0.32] hover:shadow-[0_14px_34px_-16px_rgba(0,0,0,0.75)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 [background:radial-gradient(120%_70%_at_50%_-10%,rgba(249,115,22,0.08),transparent_55%)]"
      />
      <div className="relative">
        <div className="flex items-start gap-3">
          <span className="text-[22px] leading-snug shrink-0">
            {project.flag ?? <Flame size={18} className="text-ember-400 mt-1" />}
          </span>
          <h3 className="text-[16px] font-semibold text-stone-50 tracking-[-0.01em] leading-tight">
            {project.title}
          </h3>
          <button
            onClick={onDelete}
            aria-label="Delete project"
            className="ml-auto grid place-items-center w-[30px] h-[30px] rounded-[7px] text-stone-500 shrink-0 transition hover:text-[#e0795c] hover:bg-[rgba(216,90,60,0.1)]"
          >
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>

        <p className="mt-3 text-[13.5px] text-stone-400 leading-relaxed min-h-[44px] line-clamp-2">{project.description}</p>

        <div className="mt-4 pt-[15px] border-t border-white/[0.045] flex items-center gap-3.5">
          <Badge variant={complete ? "complete" : "draft"}>{t(complete ? "status_complete" : "status_draft")}</Badge>
          <span className="ml-auto flex gap-3.5">
            <button onClick={onWizard} className="inline-flex items-center gap-1.5 text-[12.5px] text-stone-400 transition hover:text-ember-400">
              <Wand2 size={14} strokeWidth={1.75} />
              {t("wizard")}
            </button>
            <button onClick={onDocs} className="inline-flex items-center gap-1.5 text-[12.5px] text-stone-400 transition hover:text-ember-400">
              <FileText size={14} strokeWidth={1.75} />
              {t("docs")}
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}
