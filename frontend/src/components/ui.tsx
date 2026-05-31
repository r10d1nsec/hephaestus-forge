import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../lib/cn";

/* ---------------- Button ---------------- */
type Variant = "primary" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const sizeCls: Record<Size, string> = {
  sm: "h-8 px-3 text-[12.5px] rounded-md gap-1.5",
  md: "",
  lg: "h-[46px] px-[22px] text-[15px] rounded-[10px]",
};
const variantCls: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  quiet: "btn-quiet h-8 px-2.5 rounded-md",
};

export function Button({
  variant = "ghost",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button className={cn("btn-base", variantCls[variant], sizeCls[size], className)} {...props}>
      {children}
    </button>
  );
}

/* ---------------- Badge ---------------- */
export function Badge({ variant = "complete", children }: { variant?: "complete" | "draft"; children: ReactNode }) {
  const dot = variant === "complete" ? "bg-ember-400 shadow-[0_0_6px_rgba(249,115,22,0.45)]" : "bg-stone-500";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-[3px] rounded-full",
        variant === "complete"
          ? "text-ember-300 bg-ember-500/[0.08] edge-ember"
          : "text-stone-400 bg-white/[0.032] edge",
      )}
    >
      <span className={cn("w-[5px] h-[5px] rounded-full", dot)} />
      {children}
    </span>
  );
}

/* ---------------- Inputs ---------------- */
const fieldBase =
  "w-full bg-white/[0.018] edge rounded-[10px] px-[15px] py-[13px] text-[15px] text-stone-50 " +
  "placeholder:text-stone-500 transition focus:outline-none focus:border-ember-500/60 " +
  "focus:bg-white/[0.032] focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-[150px] resize-y leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        fieldBase,
        "h-[42px] py-0 text-[14px] appearance-none bg-no-repeat",
        "[background-position:right_13px_center]",
        "[background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='none'%20stroke='%23a8a29e'%20stroke-width='2'%20stroke-linecap='round'%3E%3Cpath%20d='m4%206%204%204%204-4'/%3E%3C/svg%3E\")]",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

/* ---------------- Tabs ---------------- */
export interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export function Tabs({ items, active, onChange }: { items: TabItem[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="inline-flex gap-1 p-1 rounded-[10px] bg-white/[0.018] edge" role="tablist">
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(it.id)}
            className={cn(
              "inline-flex items-center gap-2 h-[34px] px-3.5 rounded-[7px] text-[13px] font-medium transition",
              on
                ? "text-[#1a0f06] bg-gradient-to-b from-ember-400 to-ember-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_12px_-6px_rgba(249,115,22,0.45)]"
                : "text-stone-400 hover:text-stone-50",
            )}
          >
            {it.icon}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
