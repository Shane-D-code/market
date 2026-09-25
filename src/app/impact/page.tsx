"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  PiggyBank,
  FlaskConical,
  Trophy,
  BadgeCheck,
} from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import { getImpact } from "@/lib/api/client";
import { usePageData } from "@/hooks/use-page-data";
import { formatINR, dateLabel, relativeTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { MoneyAmount } from "@/features/shared/primitives";

const STAGE_ICONS = {
  "Opportunity detected": 0,
  "Action taken": 1,
  "Customer responded": 2,
  "Revenue recovered": 3,
} as const;

export default function ImpactPage() {
  const { data, loading } = usePageData(getImpact, []);

  if (loading || !data) {
    return (
      <div>
        <PageHeader
          title="Impact"
          subtitle="What has HISAAB actually done for my business?"
        />
        <Skeleton className="h-48 rounded-2xl" />
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Revenue recovered", value: formatINR(data.summary.revenueRecovered), icon: BadgeCheck, tone: "text-success" },
    { label: "Customers returned", value: String(data.summary.customersReturned), icon: Users, tone: "text-ink" },
    { label: "Costs avoided", value: formatINR(data.summary.costsAvoided), icon: PiggyBank, tone: "text-success" },
    { label: "Experiments", value: String(data.summary.experimentsRun), icon: FlaskConical, tone: "text-ink" },
    { label: "Positive outcomes", value: String(data.summary.positiveExperiments), icon: Trophy, tone: "text-success" },
  ];

  return (
    <div>
      <PageHeader
        title="Impact"
        subtitle="What has HISAAB actually done for your business? Measured, not promised."
      />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl bg-gradient-to-br from-paytm-deep to-paytm-secondary p-6 text-white shadow-pop sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-lightblue">
          September
        </p>
        <p className="mt-2 text-5xl font-extrabold tracking-tight lg:text-6xl">
          {formatINR(data.summary.recoveredThisMonth)}
        </p>
        <p className="mt-2 max-w-xl text-lg font-medium text-lightblue">
          recovered this month — every rupee traced to an action you approved.
        </p>
      </motion.section>

      <Link
        href="/impact"
        className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-success/25 bg-successsoft px-5 py-4 transition hover:border-success/50 hover:shadow-card"
      >
        <span>
          <span className="block text-2xs font-bold uppercase tracking-widest text-success">Latest measured recovery</span>
          <span className="mt-1 block text-xl font-extrabold text-ink">₹1,200 Recovered</span>
        </span>
        <span className="text-sm font-bold text-success">Open impact record →</span>
      </Link>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-line bg-white p-4 shadow-card"
          >
            <s.icon className={`size-4 ${s.tone}`} aria-hidden />
            <p className={`mt-2 text-2xl font-extrabold tracking-tight ${s.tone}`}>
              {s.value}
            </p>
            <p className="mt-1 text-2xs font-semibold uppercase tracking-widest text-inksoft/80">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Outcome timelines */}
      <section className="mt-10" aria-labelledby="outcomes-heading">
        <h2 id="outcomes-heading" className="mb-5 text-2xl font-extrabold tracking-tight text-ink">
          How it happened
        </h2>
        <div className="space-y-4">
          {data.outcomes.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-line bg-white p-5 shadow-card"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-base font-bold text-ink">{o.actionTitle}</p>
                <p className="text-sm font-bold text-success">
                  {formatINR(o.recovered)} recovered
                  {o.costsAvoided > 0 && ` · ${formatINR(o.costsAvoided)} avoided`}
                </p>
              </div>
              <p className="mt-0.5 text-xs text-inksoft">
                Expected {formatINR(o.expected)} · {o.customersReturned} customers returned ·{" "}
                {dateLabel(o.completedAt)}
              </p>

              <div className="mt-5 grid gap-0 sm:grid-cols-4">
                {o.timeline.map((t, j) => {
                  const isFinal = j === o.timeline.length - 1;
                  return (
                    <div key={j} className="relative pr-4">
                      {j < o.timeline.length - 1 && (
                        <span
                          className="absolute left-[15px] top-8 hidden h-full w-px bg-line sm:block"
                          aria-hidden
                        />
                      )}
                      <div className="flex items-start gap-3">
                        <span
                          className={`z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-2xs font-bold ${
                            isFinal
                              ? "bg-success text-white"
                              : "bg-lightblue text-paytm-deep"
                          }`}
                        >
                          {j + 1}
                        </span>
                        <div className="pb-6">
                          <p className="text-xs font-bold uppercase tracking-wide text-ink">
                            {t.stage}
                          </p>
                          <p className="mt-0.5 text-sm text-inksoft">{t.detail}</p>
                          <p className="mt-0.5 text-2xs text-muted">
                            {dateLabel(t.at)} · {relativeTime(t.at)}
                            {t.value ? ` · ${formatINR(t.value)}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
