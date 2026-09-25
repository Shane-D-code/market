"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ChevronRight, Wallet } from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import { formatINR, formatINRCompact, cn } from "@/lib/utils";
import { getCashFlow, getOpportunities } from "@/lib/api/client";
import { usePageData } from "@/hooks/use-page-data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBadge } from "@/features/shared/primitives";
import { opportunityHref } from "@/lib/mock-data/opportunities";

const GROW_CARDS = [
  {
    oppId: "opp_004",
    title: "Increase stock before demand spike",
    impact: "+₹8,000",
    impactLabel: "Potential impact",
    why: "Friday–Saturday revenue runs 24% above average and stock ran out twice this month.",
    confidence: 82,
    cta: "Explore",
  },
  {
    oppId: "opp_005",
    title: "Bundle high-frequency products",
    impact: "+₹5,500",
    impactLabel: "Potential impact",
    why: "68% of saree buyers add stitching separately — bundling raises order value.",
    confidence: 76,
    cta: "Explore",
  },
  {
    oppId: "opp_003",
    title: "Reduce low-performing discount",
    impact: "₹3,200",
    impactLabel: "Margin improvement",
    why: "The 10% discount raises revenue slightly but loses margin. Low-response customers cost the most.",
    confidence: 81,
    cta: "Run Experiment",
  },
];

export default function GrowPage() {
  const { data: flow } = usePageData(getCashFlow, []);
  const { data: opps } = usePageData(getOpportunities, []);

  return (
    <div>
      <PageHeader
        title="Grow what you have"
        subtitle="Understand what's left and where it can create more value."
      />

      {/* Hero leftover */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl bg-gradient-to-br from-paytm-deep to-paytm-secondary p-6 text-white shadow-pop sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-lightblue">
              Projected leftover
            </p>
            <p className="mt-2 text-5xl font-extrabold tracking-tight lg:text-6xl">
              {formatINR(25000)}
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-lightblue">
              Based on current revenue, upcoming commitments, current expenditure and
              your historical cash-flow pattern.
            </p>
          </div>
          <div className="w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-lightblue">
              <span>Revenue</span>
              <span className="font-semibold text-white">{formatINRCompact(500000)}</span>
            </div>
            <div className="flex justify-between text-lightblue">
              <span>Current expenses</span>
              <span className="font-semibold text-white">− {formatINRCompact(355000)}</span>
            </div>
            <div className="flex justify-between text-lightblue">
              <span>Upcoming commitments</span>
              <span className="font-semibold text-white">− {formatINRCompact(120000)}</span>
            </div>
            <div className="border-t border-white/20 pt-2">
              <div className="flex justify-between">
                <span className="text-lightblue">Projected leftover</span>
                <span className="text-lg font-extrabold">{formatINR(25000)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal cash-flow visualization */}
        <div className="mt-6">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/15" aria-hidden>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(355000 / 500000) * 100}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-white/50"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(120000 / 500000) * 100}%` }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="h-full bg-warn"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(25000 / 500000) * 100}%` }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-full bg-[#7CF2C4]"
            />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-2xs font-semibold text-lightblue">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-white/50" aria-hidden /> Current expenses
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-warn" aria-hidden /> Upcoming commitments
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#7CF2C4]" aria-hidden /> Leftover
            </span>
          </div>
        </div>

        {flow && (
          <p className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-lightblue">
            {flow.summary.naturalSummary}
          </p>
        )}
      </motion.section>

      {/* Cash-flow timeline */}
      {flow && (
        <section className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6" aria-labelledby="timeline-heading">
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-paytm-secondary" aria-hidden />
            <h2 id="timeline-heading" className="text-lg font-bold text-ink">
              What's committed next
            </h2>
          </div>
          <div className="mt-4">
            {flow.commitments
              .slice()
              .sort((a, b) => a.dueInDays - b.dueInDays)
              .map((c, i, arr) => (
                <div key={c.id} className="relative flex items-center gap-4 pb-5">
                  {i < arr.length - 1 && (
                    <span className="absolute left-[11px] top-7 h-full w-px bg-line" aria-hidden />
                  )}
                  <span className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-paytm/25 bg-white">
                    <span className="size-2 rounded-full bg-paytm" aria-hidden />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-bold text-ink">
                      {c.label}
                      <span className="ml-2 text-xs font-medium text-inksoft">
                        in {c.dueInDays} {c.dueInDays === 1 ? "day" : "days"}
                      </span>
                    </p>
                    <p className="text-sm font-semibold">{formatINR(c.amount)}</p>
                  </div>
                </div>
              ))}
            <div className="relative flex items-center gap-4">
              <span className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-success">
                <ArrowDown className="size-3.5 text-white" aria-hidden />
              </span>
              <p className="text-sm font-bold text-success">
                Projected leftover {formatINR(25000)} — after everything above is paid.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Growth opportunities */}
      <section className="mt-10" aria-labelledby="opps-heading">
        <h2 id="opps-heading" className="mb-5 text-2xl font-extrabold tracking-tight text-ink">
          Growth opportunities
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {!opps
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)
            : GROW_CARDS.map((g, i) => {
                const href = g.oppId === "opp_003" ? "/experiments/discount-10" : opportunityHref(g.oppId);
                return (
                  <motion.div
                    key={g.oppId}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card"
                  >
                    <Badge variant="success">GROW</Badge>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-ink">{g.title}</h3>

                    <div className="mt-4">
                      <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">Why</p>
                      <p className="mt-1 text-sm text-inksoft">{g.why}</p>
                    </div>

                    <div className="mt-3">
                      <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">{g.impactLabel}</p>
                      <p className="mt-0.5 text-xl font-extrabold text-success">{g.impact}</p>
                    </div>

                    <div className="mt-3">
                      <ConfidenceBadge value={g.confidence} />
                    </div>

                    <div className="mt-auto pt-5">
                      <Link href={href} className={cn(buttonVariants(), "w-full")}>
                        {g.cta}
                        <ChevronRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
        </div>
      </section>
    </div>
  );
}
