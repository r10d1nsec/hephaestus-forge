import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download, Loader2, FileText } from "lucide-react";
import { api, streamSSE } from "../lib/api";

const DOC_LABELS: Record<string, string> = {
  prd: "PRD",
  tech_spec: "Technical Spec",
  estimation: "Estimation",
};
const DOC_ORDER = ["prd", "tech_spec", "estimation"];

export default function Documents() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const [contents, setContents] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState("prd");
  const [generating, setGenerating] = useState(false);
  const startedGen = useRef(false);

  useEffect(() => {
    if (!id) return;
    api.listDocuments(id).then((docs) => {
      const latest: Record<string, string> = {};
      const versions: Record<string, number> = {};
      for (const d of docs) {
        if (!(d.doc_type in versions) || d.version > versions[d.doc_type]) {
          latest[d.doc_type] = d.content;
          versions[d.doc_type] = d.version;
        }
      }
      setContents(latest);
    });
    if (params.get("generate") === "1" && !startedGen.current) {
      startedGen.current = true;
      runGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function runGeneration() {
    if (!id) return;
    setGenerating(true);
    setContents({});
    streamSSE(
      `/api/projects/${id}/generate`,
      (ev) => {
        if (ev.doc_start) setSelected(ev.doc_start);
        if (ev.delta) {
          setContents((c) => ({ ...c, [ev.doc_type]: (c[ev.doc_type] || "") + ev.delta }));
        }
        if (ev.error) {
          setContents((c) => ({ ...c, [ev.doc_type]: "⚠️ " + ev.error }));
        }
        if (ev.all_done) setGenerating(false);
      },
      () => setGenerating(false)
    );
  }

  return (
    <div className="flex h-screen">
      {/* doc list */}
      <div className="w-56 border-r border-forge-border bg-forge-panel p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-forge-steel">
          Documentos
        </h2>
        {DOC_ORDER.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
              selected === t ? "bg-forge-ember/15 text-forge-ember-soft" : "text-forge-steel hover:bg-forge-border/50"
            }`}
          >
            <FileText size={15} />
            {DOC_LABELS[t]}
            {generating && !contents[t] && <Loader2 size={12} className="ml-auto animate-spin" />}
          </button>
        ))}
        <a
          href={api.exportZipUrl(id!)}
          className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-forge-border py-2 text-sm hover:border-forge-ember"
        >
          <Download size={15} /> Export ZIP
        </a>
        {!generating && (
          <button
            onClick={runGeneration}
            className="mt-2 w-full rounded-lg bg-forge-ember py-2 text-sm font-medium text-stone-950"
          >
            Regenerar
          </button>
        )}
      </div>

      {/* viewer */}
      <div className="flex-1 overflow-y-auto px-10 py-8">
        {generating && !contents[selected] ? (
          <div className="flex items-center gap-2 text-forge-steel">
            <Loader2 size={16} className="animate-spin" /> Forjando {DOC_LABELS[selected]}…
          </div>
        ) : contents[selected] ? (
          <article className="prose-forge max-w-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contents[selected]}</ReactMarkdown>
          </article>
        ) : (
          <div className="text-forge-steel">
            No hay contenido todavía. Pulsa <span className="text-forge-ember-soft">Regenerar</span>.
          </div>
        )}
      </div>
    </div>
  );
}
