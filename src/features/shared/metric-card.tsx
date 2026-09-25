"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MoneyAmount, TrendIndicator, type StatusTone } from "./primitives";
import { StatusBadge } from "./primitives";

type MetricTone = "neutral" | "paytm" | "warning" | "success";

const TONE_STYLES: Record<
  MetricTone,
  { accent: string; value: "ink" | "paytm" | "deep" | "success" | "danger"; chip?: string }
> = {
  neutral: { accent: "bg-paytm/70", value: "ink" },
  paytm: { accent: "bg-paytm", value: "deep" },
  warning: { accent: "bg-warn", value: "danger", chip: "warning" as StatusTone },
  success: { accent: "bg-success", value: "success" },
};

export function MetricCard({
  label,
  value,
  meaning,
  trend,
  status,
  tone = "neutral",
  href,
  delay = 0,
}: {
  label: string;
  value: string;
  meaning?: string;
  trend?: { value: string; direction: "up" | "down" | "flat"; tone?: "positive" | "negative" | "neutral" };
  status?: { label: string; tone: StatusTone };
  tone?: MetricTone;
  href?: string;
  delay?: number;
}) {
  const t = TONE_STYLES[tone];

  const body = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-card transition-all",
        href && "hover:-translate-y-0.5 hover:shadow-pop"
      )}
    >
      <span className={cn("absolute inset-x-0 top-0 h-1", t.accent)} aria-hidden />
      <p className="text-xs font-semibold uppercase tracking-widest text-inksoft/80">
        {label}
      </p>
      <MoneyAmount value={value} size="xl" tone={t.value} className="mt-3" />
      {meaning && <p className="mt-2 text-sm leading-snug text-inksoft">{meaning}</p>}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
        {trend && (
          <TrendIndicator value={trend.value} direction={trend.direction} tone={trend.tone} />
        )}
        {status && <StatusBadge label={status.label} tone={status.tone} />}
        {href && (
          <span className="ml-auto flex items-center gap-0.5 text-xs font-bold text-paytm-secondary opacity-0 transition-opacity group-hover:opacity-100">
            View <ArrowUpRight className="size-3.5" />
          </span>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full focus-visible:rounded-2xl">
        {body}
      </Link>
    );
  }
  return body;
}
