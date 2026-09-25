"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ShieldAlert, SlidersHorizontal, TrendingUp } from "lucide-react";
import type { Opportunity } from "@/types";
import { opportunityHref } from "@/lib/mock-data/opportunities";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/features/shared/primitives";

const TYPE_META = {
  PROTECT: {
    icon: ShieldAlert,
    label: "PROTECT",
    tone: "bg-dangersoft text-danger",
    border: "border-l-danger",
  },
  GROW: {
    icon: TrendingUp,
    label: "GROW",
    tone: "bg-successsoft text-success",
    border: "border-l-success",
  },
  OPTIMIZE: {
    icon: SlidersHorizontal,
    label: "OPTIMIZE",
    tone: "bg-warnsoft text-warn",
    border: "border-l-warn",
  },
} as const;

export function OpportunityCard({
  opportunity,
  href = opportunityHref(opportunity.id),
  delay = 0,
  compact = false,
}: {
  opportunity: Opportunity;
  href?: string;
  delay?: number;
  compact?: boolean;
}) {
  const meta = TYPE_META[opportunity.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="h-full"
    >
      <Link
        href={href}
        className={`group flex h-full flex-col rounded-2xl border border-line border-l-4 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-pop ${meta.border}`}
        aria-label={`${opportunity.title}. Open details`}
      >
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-bold tracking-wide ${meta.tone}`}>
            <meta.icon className="size-3" aria-hidden />
            {meta.label}
          </span>
          {opportunity.status === "APPROVAL" && <Badge variant="solid">Needs approval</Badge>}
        </div>

        <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink">{opportunity.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-inksoft">{opportunity.description}</p>

        {!compact && (
          <div className="mt-4 space-y-1.5">
            {opportunity.evidence.slice(0, 2).map((evidence) => (
              <div key={evidence.label} className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-inksoft">{evidence.label}</span>
                <span className="font-semibold text-ink">{evidence.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
              {opportunity.type === "GROW" ? "Expected impact" : "At stake"}
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-paytm-deep">{formatINR(opportunity.impact)}</p>
          </div>
          <ConfidenceBadge value={opportunity.confidence} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm font-bold text-paytm-secondary">
          <span>{opportunity.type === "PROTECT" ? "Review & Recover" : "Review opportunity"}</span>
          <ChevronRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
        </div>
      </Link>
    </motion.div>
  );
}
