import { Check, CircleCheck, Loader2, Terminal } from "lucide-react";
import { useI18n } from "../i18n";
import { cn } from "../lib/cn";
import { Button } from "./ui";
import type { CliEngine, EngineStatus } from "../types";

const statusKey: Record<EngineStatus, "st_verified" | "st_detected" | "st_notfound"> = {
  verified: "st_verified",
  detected: "st_detected",
  notfound: "st_notfound",
};

const ring: Record<EngineStatus, string> = {
  verified: "text-ok bg-ok/10 border-ok/30",
  detected: "text-warn bg-warn/10 border-warn/30",
  notfound: "text-stone-500 bg-white/[0.032] edge",
};
const dot: Record<EngineStatus, string> = {
  verified: "bg-ok shadow-[0_0_6px_rgba(111,174,95,0.5)]",
  detected: "bg-warn shadow-[0_0_6px_rgba(216,162,74,0.4)]",
  notfound: "bg-stone-500",
};
const text: Record<EngineStatus, string> = {
  verified: "text-ok",
  detected: "text-warn",
  notfound: "text-stone-500",
};

export function EngineRow({
  engine,
  icon,
  busy = false,
  onTest,
  onUse,
}: {
  engine: CliEngine;
  icon?: typeof Terminal;
  busy?: boolean;
  onTest?: () => void;
  onUse?: () => void;
}) {
  const { t } = useI18n();
  const Icon = icon ?? Terminal;
  const notFound = engine.status === "notfound";

  return (
    <div
      className={cn(
        "flex items-center gap-3.5 p-4 rounded-[14px] edge bg-gradient-to-b from-white/[0.032] to-white/[0.018] transition hover:border-white/[0.12] hover:shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
        notFound && "opacity-[0.72]",
      )}
    >
      <span className={cn("grid place-items-center w-[38px] h-[38px] rounded-[10px] border shrink-0", ring[engine.status])}>
        <Icon size={18} strokeWidth={1.75} />
      </span>

      <div className="min-w-0">
        <div className="flex items-center gap-2.5 text-[14.5px] font-semibold text-stone-50">
          {engine.name}
          <span className={cn("font-mono text-[11.5px] px-[7px] py-px rounded-[5px] bg-white/[0.032] edge-soft", notFound ? "text-stone-500" : "text-stone-400")}>
            {engine.command}
          </span>
          {engine.status === "verified" && <CircleCheck size={15} className="text-ok" strokeWidth={1.75} />}
        </div>
        <div className={cn("inline-flex items-center gap-[7px] mt-[5px] text-[12.5px]", text[engine.status])}>
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dot[engine.status])} />
          {t(statusKey[engine.status])}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 shrink-0">
        <Button variant={notFound ? "quiet" : "ghost"} size="sm" disabled={notFound || busy} onClick={onTest}>
          {busy && <Loader2 size={13} className="spin" />}
          {busy ? t("testing") : t("test")}
        </Button>
        {engine.active ? (
          <Button variant="primary" size="sm" disabled>
            <Check size={13} strokeWidth={2.2} />
            {t("in_use")}
          </Button>
        ) : notFound ? (
          <Button variant="ghost" size="sm" disabled>
            {t("install")}
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={onUse}>
            {t("use")}
          </Button>
        )}
      </div>
    </div>
  );
}
