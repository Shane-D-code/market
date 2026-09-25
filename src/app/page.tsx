"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  TrendingUp,
  Wallet,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { greeting, formatINR, formatINRCompact, formatPercent } from "@/lib/utils";
import { getOpportunities, getBusinessMemory } from "@/lib/api/client";
import { usePageData } from "@/hooks/use-page-data";
import { MetricCard } from "@/features/shared/metric-card";
import { OpportunityCard } from "@/features/opportunities/opportunity-card";
import { MemoryCard } from "@/features/shared/memory-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge, MoneyAmount } from "@/features/shared/primitives";

export default function OverviewPage() {
  const { data: opps, loading } = usePageData(getOpportunities, []);
  const { data: memory } = usePageData(getBusinessMemory, []);

  const hero = opps?.find((o) => o.id === "opp_001") ?? null;
  const optimize = opps?.find((o) => o.id === "opp_003") ?? null;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink lg:text-3xl">
          {greeting()}, Rajesh <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1.5 text-inksoft">Here's what needs your attention today.</p>
      </motion.section>

      {/* Four KPIs */}
      <section aria-label="Business snapshot">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Revenue"
            value={formatINRCompact(500000)}
            meaning="This month, all payment modes"
            trend={{ value: "+8.4% vs last month", direction: "up", tone: "positive" }}
            tone="paytm"
            href="/cash-flow"
            delay={0.02}
          />
          <MetricCard
            label="Revenue at Risk"
            value={formatINR(18400)}
            meaning="6 regulars haven't returned — recoverable"
            trend={{ value: "12% from last week", direction: "down", tone: "positive" }}
            status={{ label: "Needs attention", tone: "warning" }}
            href="/protect"
            delay={0.06}
          />
          <MetricCard
            label="Projected Leftover"
            value={formatINR(25000)}
            meaning="After upcoming commitments"
            status={{ label: "Safe to deploy", tone: "positive" }}
            href="/grow"
            delay={0.1}
          />
          <MetricCard
            label="Growth Opportunity"
            value={`+${formatINRCompact(8400)}`}
            meaning="Estimated additional monthly opportunity"
            href="/grow"
            delay={0.14}
          />
        </div>
      </section>

      <Link
        href="/impact"
        className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-success/25 bg-successsoft px-5 py-4 transition hover:border-success/50 hover:shadow-card"
      >
        <span>
          <span className="block text-2xs font-bold uppercase tracking-widest text-success">Latest outcome</span>
          <span className="mt-1 block text-xl font-extrabold text-ink">₹1,200 Recovered</span>
        </span>
        <span className="text-sm font-bold text-success">2 customers returned · View impact →</span>
      </Link>

      {/* Today's Hisaab */}
      <section aria-labelledby="todays-hisaab">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="todays-hisaab" className="text-2xl font-extrabold tracking-tight text-ink">
              Today's Hisaab
            </h2>
            <p className="mt-1 text-sm text-inksoft">
              {loading ? "Reading your numbers…" : "3 things worth acting on."}
            </p>
          </div>
          <Link
            href="/actions"
            className="flex items-center gap-1 text-sm font-bold text-paytm-secondary hover:text-paytm-deep"
          >
            All actions <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {hero && (
              <OpportunityCard opportunity={hero} delay={0.05} />
            )}

            {/* GROW — leftover math card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              <div className="flex h-full flex-col rounded-2xl border border-line border-l-4 border-l-success bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-pop">
                <span className="flex w-fit items-center gap-1.5 rounded-full bg-successsoft px-2.5 py-1 text-2xs font-bold tracking-wide text-success">
                  <TrendingUp className="size-3" aria-hidden />
                  GROW
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink">
                  You may have <MoneyAmount value={formatINR(25000)} size="sm" tone="success" className="align-baseline" /> available after commitments
                </h3>

                <div className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-inksoft">Revenue</span>
                    <span className="font-semibold">{formatINR(500000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-inksoft">Current expenses</span>
                    <span className="font-semibold">− {formatINR(355000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-inksoft">Upcoming commitments</span>
                    <span className="font-semibold">− {formatINR(120000)}</span>
                  </div>
                  <div className="my-1 border-t border-dashed border-line" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Projected leftover</span>
                    <span className="text-lg font-extrabold text-success">
                      {formatINR(25000)}
                    </span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-5">
                  <ConfidenceBadge value={84} />
                  <Button size="sm" asChild>
                    <Link href="/grow">Explore Growth</Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* OPTIMIZE — discount card */}
            {optimize && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
              >
                <div className="flex h-full flex-col rounded-2xl border border-line border-l-4 border-l-warn bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-pop">
                  <span className="flex w-fit items-center gap-1.5 rounded-full bg-warnsoft px-2.5 py-1 text-2xs font-bold tracking-wide text-warn">
                    <SlidersHorizontal className="size-3" aria-hidden />
                    OPTIMIZE
                  </span>
                  <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink">
                    Your 10% discount isn't generating enough additional sales
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-inksoft">
                    Reduce discount exposure for low-response customers.
                  </p>

                  <div className="mt-4 rounded-xl bg-warnsoft/60 p-3.5">
                    <p className="text-2xs font-semibold uppercase tracking-widest text-warn/90">
                      Estimated margin leakage
                    </p>
                    <p className="text-2xl font-extrabold text-warn">
                      {formatINR(3200)}
                    </p>
                    <p className="mt-1 text-xs text-inksoft">
                      312 redemptions · +3.8% revenue, margin still negative
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <Badge variant="outline">From experiment data</Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/experiments/discount-10">Review Experiment</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </section>

      {/* What HISAAB has learned */}
      <section aria-labelledby="memory-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="memory-heading" className="text-2xl font-extrabold tracking-tight text-ink">
              What HISAAB has learned
            </h2>
            <p className="mt-1 text-sm text-inksoft">
              Your business memory — every fact changes what we recommend.
            </p>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-1 text-sm font-bold text-paytm-secondary hover:text-paytm-deep"
          >
            Full memory <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {(memory?.facts ?? []).slice(0, 3).map((f, i) => (
            <MemoryCard
              key={f.id}
              fact={f.fact}
              category={f.category}
              confidence={f.confidence}
              source={f.source}
              whyItMatters={f.whyItMatters}
              changesRecommendations={f.changesRecommendations}
              delay={0.05 * i}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
