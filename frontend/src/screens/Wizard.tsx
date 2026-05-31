import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, Flame, Loader2, SendHorizontal, Sparkles, User } from "lucide-react";
import { useI18n } from "../i18n";
import { cn } from "../lib/cn";
import { Button } from "../components/ui";
import { api, streamSSE } from "../lib/api";
import { LANGUAGE_NAMES } from "../lib/lang";
import type { ActiveProject, Navigate } from "../App";
import type { TranslationKey } from "../i18n";

const PHASES = ["discovery", "audience", "solution_fit", "scope", "constraints"];
const PHASE_KEY: Record<string, TranslationKey> = {
  discovery: "phase_discovery",
  audience: "phase_audience",
  solution_fit: "phase_solution",
  scope: "phase_scope",
  constraints: "phase_constraints",
};

interface Msg {
  side: "ai" | "user";
  content: string;
}

function PhaseBar({ phaseIdx }: { phaseIdx: number }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center mb-[30px]">
      {PHASES.map((phase, i) => {
        const done = i < phaseIdx;
        const current = i === phaseIdx;
        const last = i === PHASES.length - 1;
        return (
          <div key={phase} className={cn("flex items-center gap-2.5 min-w-0", last ? "flex-none" : "flex-1")}>
            <span
              className={cn(
                "grid place-items-center w-7 h-7 rounded-full shrink-0 font-mono text-[12px] border transition",
                done && "text-ember-300 bg-ember-500/[0.12] edge-ember",
                current &&
                  "text-[#1a0f06] bg-gradient-to-b from-ember-400 to-ember-500 border-ember-600 shadow-[0_0_0_4px_rgba(249,115,22,0.14),0_0_16px_-4px_rgba(249,115,22,0.45)]",
                !done && !current && "text-stone-500 bg-white/[0.032] edge",
              )}
            >
              {done ? <Check size={14} strokeWidth={2.2} /> : i + 1}
            </span>
            <span className={cn("text-[12.5px] whitespace-nowrap transition max-md:hidden", current ? "text-stone-50 font-medium" : "text-stone-500")}>
              {t(PHASE_KEY[phase])}
            </span>
            {!last && (
              <span className="flex-1 min-w-[16px] mx-2.5 h-[2px] rounded bg-white/[0.07] overflow-hidden relative">
                <span
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-ember-600 to-ember-400 transition-[width] duration-500",
                    done ? "w-full" : current ? "w-2/5" : "w-0",
                  )}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Bubble({ side, children }: { side: "ai" | "user"; children: ReactNode }) {
  const isAi = side === "ai";
  return (
    <div className={cn("flex gap-3.5 max-w-[88%]", isAi ? "" : "ml-auto flex-row-reverse")}>
      <span
        className={cn(
          "grid place-items-center w-8 h-8 rounded-[9px] shrink-0 border",
          isAi ? "text-ember-400 ember-tile" : "text-stone-400 bg-white/[0.032] edge",
        )}
      >
        {isAi ? <Flame size={17} /> : <User size={16} />}
      </span>
      <div
        className={cn(
          "px-4 py-3 rounded-[14px] text-[14.5px] leading-relaxed whitespace-pre-wrap",
          isAi
            ? "bg-panel edge rounded-tl-[5px] text-stone-300"
            : "rounded-tr-[5px] text-stone-50 bg-gradient-to-b from-ember-500/[0.14] to-ember-500/[0.07] edge-ember",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Wizard({ onNavigate, project }: { onNavigate: Navigate; project: ActiveProject | null }) {
  const { t, lang } = useI18n();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [phase, setPhase] = useState("discovery");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState("");
  const [busy, setBusy] = useState(false);
  const [phaseComplete, setPhaseComplete] = useState(false);
  const [answer, setAnswer] = useState("");
  const started = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project || started.current) return;
    started.current = true;
    api.startSession(project.id).then((s) => {
      setSessionId(s.id);
      setPhase(s.phase);
      askNext(s.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  function askNext(sid: string) {
    setBusy(true);
    setStreaming("");
    setPhaseComplete(false);
    let buf = "";
    streamSSE(
      `/api/sessions/${sid}/next`,
      (ev) => {
        if (ev.delta) {
          buf += ev.delta;
          setStreaming(buf.replace("[[PHASE_COMPLETE]]", "").trim());
        }
        if (ev.done) {
          setPhaseComplete(!!ev.phase_complete);
          const clean = buf.replace("[[PHASE_COMPLETE]]", "").trim();
          if (clean) setMessages((m) => [...m, { side: "ai", content: clean }]);
          setStreaming("");
          setBusy(false);
        }
        if (ev.error) {
          setMessages((m) => [...m, { side: "ai", content: "⚠️ " + ev.error }]);
          setStreaming("");
          setBusy(false);
        }
      },
      undefined,
      { lang: LANGUAGE_NAMES[lang] },
    );
  }

  async function send() {
    if (!answer.trim() || !sessionId || busy) return;
    const text = answer.trim();
    setMessages((m) => [...m, { side: "user", content: text }]);
    setAnswer("");
    await api.answer(sessionId, text);
    askNext(sessionId);
  }

  async function nextPhase() {
    if (!sessionId) return;
    const res = await api.advance(sessionId);
    if ("finished" in res) {
      generate();
    } else {
      setSessionId(res.id);
      setPhase(res.phase);
      setMessages((m) => [...m, { side: "ai", content: `— ${t(PHASE_KEY[res.phase])} —` }]);
      askNext(res.id);
    }
  }

  function generate() {
    if (project) onNavigate("documents", { project, generate: true });
  }

  const phaseIdx = PHASES.indexOf(phase);

  if (!project) {
    return <div className="screen-in text-stone-400">{t("dash_sub")}</div>;
  }

  return (
    <div className="screen-in max-w-[820px] mx-auto">
      <PhaseBar phaseIdx={phaseIdx} />

      <div className="flex flex-col gap-[18px] py-1 pb-2">
        {messages.map((m, i) => (
          <Bubble key={i} side={m.side}>{m.content}</Bubble>
        ))}
        {streaming && (
          <Bubble side="ai">
            {streaming}
            <span className="type-caret" aria-hidden />
          </Bubble>
        )}
        {busy && !streaming && (
          <div className="flex items-center gap-2 text-[13px] text-stone-500">
            <Loader2 size={14} className="spin" /> {t("thinking")}
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {phaseComplete && (
        <button
          onClick={nextPhase}
          className="btn-base btn-primary w-full my-3"
        >
          <Sparkles size={15} strokeWidth={1.75} />
          {phaseIdx >= PHASES.length - 1 ? t("generate_docs") : t("next_phase")}
        </button>
      )}

      <div className="sticky bottom-[18px] mt-[26px] p-3 rounded-[14px] bg-panel edge shadow-[0_14px_34px_-16px_rgba(0,0,0,0.75)]">
        <div className="flex gap-2.5 items-end">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={t("wiz_ph")}
            rows={1}
            disabled={busy}
            className="flex-1 bg-transparent px-2 py-2.5 text-[15px] text-stone-50 placeholder:text-stone-500 resize-none outline-none min-h-[46px] max-h-[160px] leading-relaxed disabled:opacity-50"
          />
          <button
            aria-label="Send"
            onClick={send}
            disabled={busy || !answer.trim()}
            className="grid place-items-center w-[42px] h-[42px] shrink-0 rounded-[9px] text-[#1a0f06] bg-gradient-to-b from-ember-400 to-ember-500 border border-ember-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_16px_-8px_rgba(249,115,22,0.45)] transition hover:-translate-y-px disabled:opacity-40"
          >
            <SendHorizontal size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2.5 px-1">
          <span className="font-mono text-[11.5px] text-stone-500">{t("composer_hint")}</span>
          {phaseIdx >= 1 && (
            <Button variant="ghost" size="sm" onClick={generate}>
              <Sparkles size={13} strokeWidth={1.75} />
              {t("have_enough")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
