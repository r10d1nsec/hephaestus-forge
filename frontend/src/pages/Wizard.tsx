import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { api, streamSSE, WizardSession } from "../lib/api";

const PHASE_LABELS: Record<string, string> = {
  discovery: "Discovery",
  scope: "Scope",
  technical: "Technical",
  goals: "Goals",
};
const PHASES = ["discovery", "scope", "technical", "goals"];

interface Msg {
  role: "assistant" | "user";
  content: string;
}

export default function Wizard() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [session, setSession] = useState<WizardSession | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState("");
  const [busy, setBusy] = useState(false);
  const [phaseComplete, setPhaseComplete] = useState(false);
  const [answer, setAnswer] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (!id || started.current) return;
    started.current = true;
    api.startSession(id).then((s) => {
      setSession(s);
      askNext(s.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function askNext(sessionId: string) {
    setBusy(true);
    setStreaming("");
    setPhaseComplete(false);
    let buf = "";
    streamSSE(
      `/api/sessions/${sessionId}/next`,
      (ev) => {
        if (ev.delta) {
          buf += ev.delta;
          setStreaming(buf.replace("[[PHASE_COMPLETE]]", "").trim());
        }
        if (ev.done) {
          setPhaseComplete(!!ev.phase_complete);
          const clean = buf.replace("[[PHASE_COMPLETE]]", "").trim();
          if (clean) setMessages((m) => [...m, { role: "assistant", content: clean }]);
          setStreaming("");
          setBusy(false);
        }
        if (ev.error) {
          setMessages((m) => [...m, { role: "assistant", content: "⚠️ " + ev.error }]);
          setStreaming("");
          setBusy(false);
        }
      }
    );
  }

  async function send() {
    if (!answer.trim() || !session || busy) return;
    const text = answer.trim();
    setMessages((m) => [...m, { role: "user", content: text }]);
    setAnswer("");
    await api.answer(session.id, text);
    askNext(session.id);
  }

  async function nextPhase() {
    if (!session) return;
    const res = await api.advance(session.id);
    if ("finished" in res) {
      generate();
    } else {
      setSession(res);
      setMessages((m) => [...m, { role: "assistant", content: `— Fase ${PHASE_LABELS[res.phase]} —` }]);
      askNext(res.id);
    }
  }

  function generate() {
    nav(`/project/${id}/documents?generate=1`);
  }

  const phaseIdx = session ? PHASES.indexOf(session.phase) : 0;

  return (
    <div className="mx-auto flex h-screen max-w-3xl flex-col px-8 py-8">
      {/* progress */}
      <div className="mb-6 flex gap-2">
        {PHASES.map((p, i) => (
          <div key={p} className="flex-1">
            <div
              className={`h-1.5 rounded-full ${i <= phaseIdx ? "bg-forge-ember" : "bg-forge-border"}`}
            />
            <span className={`mt-1 block text-xs ${i === phaseIdx ? "text-forge-ember-soft" : "text-forge-steel"}`}>
              {PHASE_LABELS[p]}
            </span>
          </div>
        ))}
      </div>

      {/* conversation */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>{m.content}</Bubble>
        ))}
        {streaming && <Bubble role="assistant">{streaming}<Caret /></Bubble>}
        {busy && !streaming && (
          <div className="flex items-center gap-2 text-sm text-forge-steel">
            <Loader2 size={14} className="animate-spin" /> Hephaestus está pensando…
          </div>
        )}
      </div>

      {/* phase complete / generate */}
      {phaseComplete && (
        <button
          onClick={nextPhase}
          className="ember-glow my-3 flex items-center justify-center gap-2 rounded-lg bg-forge-ember py-2.5 font-medium text-stone-950"
        >
          <Sparkles size={16} />
          {phaseIdx >= PHASES.length - 1 ? "Generar documentos" : "Siguiente fase →"}
        </button>
      )}

      {/* input */}
      <div className="mt-3 flex gap-2">
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={busy}
          placeholder="Tu respuesta…"
          className="flex-1 rounded-lg border border-forge-border bg-forge-panel px-4 py-3 text-sm disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={busy || !answer.trim()}
          className="rounded-lg bg-forge-ember px-4 text-stone-950 disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>
      {phaseIdx >= 1 && (
        <button onClick={generate} className="mt-2 text-xs text-forge-steel hover:text-forge-ember-soft">
          Tengo suficiente — generar documentos ahora →
        </button>
      )}
    </div>
  );
}

function Bubble({ role, children }: { role: "assistant" | "user"; children: React.ReactNode }) {
  const isAI = role === "assistant";
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
          isAI
            ? "border border-forge-border bg-forge-panel text-stone-200"
            : "bg-forge-ember/90 text-stone-950"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Caret() {
  return <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-forge-ember align-middle" />;
}
