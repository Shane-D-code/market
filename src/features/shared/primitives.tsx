"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/** Financial amount — the visually strongest element anywhere it appears. */
export function MoneyAmount({
  value,
  size = "md",
  tone = "ink",
  className,
}: {
  value: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  tone?: "ink" | "paytm" | "deep" | "success" | "danger" | "warn" | "white";
  className?: string;
}) {
  const sizes = {
    sm: "text-base font-bold",
    md: "text-2xl font-extrabold tracking-tight",
    lg: "text-3xl font-extrabold tracking-tight",
    xl: "text-4xl font-extrabold tracking-tight",
    hero: "text-5xl font-extrabold tracking-tight lg:text-6xl",
  };
  const tones = {
    ink: "text-ink",
    paytm: "text-paytm-secondary",
    deep: "text-paytm-deep",
    success: "text-success",
    danger: "text-danger",
    warn: "text-warn",
    white: "text-white",
  };
  return (
    <span className={cn("tabular-nums", sizes[size], tones[tone], className)}>
      {value}
    </span>
  );
}

/** Trend pill with icon + direction — never color-only (has arrow + text). */
export function TrendIndicator({
  value,
  direction,
  tone,
  className,
}: {
  value: string;
  direction: "up" | "down" | "flat";
  tone?: "positive" | "negative" | "neutral";
  className?: string;
}) {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const resolved =
    tone ??
    (direction === "flat" ? "neutral" : direction === "up" ? "positive" : "negative");
  const tones = {
    positive: "text-success bg-successsoft",
    negative: "text-danger bg-dangersoft",
    neutral: "text-inksoft bg-lightblue",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-bold",
        tones[resolved],
        className
      )}
    >
      <Icon className="size-3" aria-hidden />
      {value}
    </span>
  );
}

/** Confidence with a progress ring — blue gradient by score. */
export function ConfidenceBadge({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const tone = value >= 85 ? "success" : value >= 70 ? "warn" : "outline";
  return (
    <Badge variant={tone} className={className}>
      <span aria-hidden>{value >= 85 ? "●●●" : value >= 70 ? "●●○" : "●○○"}</span>
      {value}% confidence
    </Badge>
  );
}

export type StatusTone =
  | "neutral"
  | "info"
  | "positive"
  | "warning"
  | "negative";

const STATUS_TONES: Record<StatusTone, string> = {
  neutral: "bg-lightblue text-paytm-deep",
  info: "bg-paytm text-white",
  positive: "bg-successsoft text-success",
  warning: "bg-warnsoft text-warn",
  negative: "bg-dangersoft text-danger",
};

/** Semantic status chip — always paired with a label, not color alone. */
export function StatusBadge({
  label,
  tone = "neutral",
  dot = true,
  className,
}: {
  label: string;
  tone?: StatusTone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-2xs font-bold tracking-wide",
        STATUS_TONES[tone],
        className
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {label}
    </span>
  );
}
