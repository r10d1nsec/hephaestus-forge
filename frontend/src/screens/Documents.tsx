import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Compass, Download, FileText, Gauge, Layers, Loader2, RefreshCw } from "lucide-react";
import { useI18n } from "../i18n";
import type { TranslationKey } from "../i18n";
import { cn } from "../lib/cn";
import { Button } from "../components/ui";
import { api, streamSSE } from "../lib/api";
import { LANGUAGE_NAMES } from "../lib/lang";
import type { ActiveProject } from "../App";

const DOCS: { id: string; labelKey?: TranslationKey; label?: string; icon: typeof FileText }[] = [
  { id: "blueprint", labelKey: "doc_blueprint", icon: Compass },
  { id: "prd", label: "PRD", icon: FileText },
  { id: "tech_spec", labelKey: "doc_spec", icon: Layers },
  { id: "estimation", labelKey: "doc_estimation", icon: Gauge },
];

export function Documents({ project, autoGenerate }: { project: ActiveProject | null; autoGenerate: boolean }) {
  const { t, lang } = useI18n();
  const [contents, setContents] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState("blueprint");
  const [generating, setGenerating] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!project) return;
    api.listDocuments(project.id).then((docs) => {
      const latest: Record<string, string> = {};
      const ver: Record<string, number> = {};
      for (const d of docs) {
        if (!(d.doc_type in ver) || d.version > ver[d.doc_type]) {
          latest[d.doc_type] = d.content;
          ver[d.doc_type] = d.version;
        }
      }
      setContents(latest);
    });
    if (autoGenerate && !started.current) {
      started.current = true;
      runGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  function runGeneration() {
    if (!project) return;
    setGenerating(true);
    setContents({});
    setSelected("blueprint");
    streamSSE(
      `/api/projects/${project.id}/generate`,
      (ev) => {
        if (ev.doc_start) setSelected(ev.doc_start);
        if (ev.delta) setContents((c) => ({ ...c, [ev.doc_type]: (c[ev.doc_type] || "") + ev.delta }));
        if (ev.error) setContents((c) => ({ ...c, [ev.doc_type]: "⚠️ " + ev.error }));
        if (ev.all_done) setGenerating(false);
      },
      () => setGenerating(false),
      { lang: LANGUAGE_NAMES[lang] },
    );
  }

  const docLabel = (d: (typeof DOCS)[number]) => d.label ?? t(d.labelKey!);

  if (!project) return <div className="screen-in text-stone-400">{t("docs_sub")}</div>;

  return (
    <div className="screen-in">
      <header className="mb-[30px]">
        <h1 className="text-[25px] font-semibold tracking-[-0.022em] text-stone-50">{project.title}</h1>
        <p className="mt-1.5 text-[14.5px] text-stone-400">{t("docs_sub")}</p>
      </header>

      <div className="grid gap-7 items-start [grid-template-columns:248px_1fr] max-lg:grid-cols-1">
        <aside className="sticky top-6 max-lg:static">
          <div className="px-2.5 pb-2.5 font-mono text-[10.5px] tracking-[0.12em] uppercase text-stone-500">
            {t("docs_label")}
          </div>
          <div className="flex flex-col gap-[3px]">
            {DOCS.map((d) => {
              const on = d.id === selected;
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelected(d.id)}
                  className={cn(
                    "flex items-center gap-2.5 h-[38px] px-[11px] rounded-lg text-[13.5px] border transition",
                    on
                      ? "text-ember-300 bg-ember-500/[0.08] edge-ember"
                      : "text-stone-400 border-transparent hover:text-stone-50 hover:bg-white/[0.032]",
                  )}
                >
                  <Icon size={16} strokeWidth={1.75} className={on ? "text-ember-400" : "text-stone-500"} />
                  <span>{docLabel(d)}</span>
                  {generating && !contents[d.id] && <Loader2 size={13} className="ml-auto spin text-stone-500" />}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <a href={api.exportZipUrl(project.id)} className="btn-base btn-ghost w-full">
              <Download size={15} strokeWidth={1.75} />
              {t("export_zip")}
            </a>
            <Button variant="primary" className="w-full" onClick={runGeneration} disabled={generating}>
              {generating ? <Loader2 size={15} className="spin" /> : <RefreshCw size={15} strokeWidth={1.75} />}
              {t("regenerate")}
            </Button>
          </div>
        </aside>

        <div className="max-w-[760px]">
          {generating && !contents[selected] ? (
            <div className="flex items-center gap-2 text-stone-400">
              <Loader2 size={16} className="spin" /> {t("forging")}
            </div>
          ) : contents[selected] ? (
            <article className="prose-forge">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{contents[selected]}</ReactMarkdown>
            </article>
          ) : (
            <div className="text-stone-400 text-[14px]">{t("no_content")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
