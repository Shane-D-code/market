"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowDownCircle, ArrowUpCircle, CalendarClock, Wallet, TrendingDown } from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import { getCashFlow } from "@/lib/api/client";
import { usePageData } from "@/hooks/use-page-data";
import { formatINR, formatINRCompact } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const IN_COLOR = "#00BAF2";
const OUT_COLOR = "#5F6C7B";

export default function CashFlowPage() {
  const { data, loading, error, reload } = usePageData(getCashFlow, []);

  if (loading || error || !data) {
    return (
      <div>
        <PageHeader title="Cash Flow" subtitle="Where your money is going." />
        {error ? (
          <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
            <p className="text-sm font-semibold text-ink">
              Paytm data hasn't synced yet.
            </p>
            <p className="mt-1 text-sm text-inksoft">
              Last successful sync: 10:42 AM today.
            </p>
            <button
              onClick={reload}
              className="mt-4 rounded-lg bg-paytm px-4 py-2 text-sm font-bold text-white hover:bg-[#00a9dc]"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="mt-6 h-80 rounded-2xl" />
          </>
        )}
      </div>
    );
  }

  const cards = [
    {
      label: "Money In",
      value: formatINRCompact(data.summary.moneyIn),
      icon: ArrowUpCircle,
      tone: "text-paytm-secondary",
      note: "This month, all payment modes",
    },
    {
      label: "Money Out",
      value: formatINRCompact(data.summary.moneyOut),
      icon: ArrowDownCircle,
      tone: "text-ink",
      note: "Stock, utilities, daily costs",
    },
    {
      label: "Upcoming",
      value: formatINRCompact(data.summary.upcomingCommitments),
      icon: CalendarClock,
      tone: "text-warn",
      note: "Rent · supplier · salary",
    },
    {
      label: "Projected Leftover",
      value: formatINRCompact(data.summary.projectedLeftover),
      icon: Wallet,
      tone: "text-success",
      note: "Safe to deploy — yours to grow with",
    },
  ];

  return (
    <div>
      <PageHeader title="Cash Flow" subtitle="Where your money is going." />

      {/* Natural language summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-paytm-deep to-paytm-secondary p-6 text-white shadow-pop"
      >
        <p className="text-xl font-bold leading-relaxed lg:text-2xl">
          {data.summary.naturalSummary}
        </p>
        <p className="mt-2 text-sm text-lightblue">
          Nothing for you to calculate — HISAAB watches the dates for you.
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-line bg-white p-4 shadow-card"
          >
            <div className="flex items-center gap-2">
              <c.icon className={`size-4 ${c.tone}`} aria-hidden />
              <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/80">
                {c.label}
              </p>
            </div>
            <p className={`mt-2 text-2xl font-extrabold tracking-tight lg:text-3xl ${c.tone}`}>
              {c.value}
            </p>
            <p className="mt-1 text-2xs text-inksoft/80">{c.note}</p>
          </motion.div>
        ))}
      </div>

      {/* Timeline — money in / out by day */}
      <section className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6" aria-labelledby="events-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="events-heading" className="text-lg font-bold text-ink">
              Next 7 days
            </h2>
            <p className="text-sm text-inksoft">
              Every expected movement, dated and explained.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-inksoft">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-paytm" aria-hidden /> Money in
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-inksoft" aria-hidden /> Money out
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-0">
          {data.events.map((e, i, arr) => {
            const isIn = e.kind === "IN";
            const dayLabel =
              e.inDays === 0 ? "Today" : e.inDays === 1 ? "Tomorrow" : `${e.inDays} days`;
            return (
              <div key={i} className="relative flex items-start gap-4 pb-5">
                {i < arr.length - 1 && (
                  <span className="absolute left-[11px] top-7 h-full w-px bg-line" aria-hidden />
                )}
                <span
                  className={`z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${
                    isIn ? "bg-paytm" : e.inDays <= 2 ? "bg-warn" : "bg-inksoft"
                  }`}
                >
                  {isIn ? (
                    <ArrowDownCircle className="size-3.5 text-white" aria-hidden />
                  ) : (
                    <TrendingDown className="size-3.5 text-white" aria-hidden />
                  )}
                </span>
                <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                  <p className="text-sm">
                    <span className="font-bold text-ink">{dayLabel}</span>
                    <span className="ml-2 text-inksoft">{e.label}</span>
                    {e.note && (
                      <span className="ml-1.5 text-2xs text-muted">· {e.note}</span>
                    )}
                  </p>
                  <p
                    className={`text-sm font-extrabold ${
                      isIn ? "text-paytm-secondary" : e.inDays <= 2 ? "text-warn" : "text-ink"
                    }`}
                  >
                    {isIn ? "+" : "−"}
                    {formatINR(e.amount)}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-4 rounded-xl bg-successsoft px-4 py-3">
            <Wallet className="size-5 text-success" aria-hidden />
            <p className="text-sm font-bold text-success">
              Projected leftover: {formatINR(data.summary.projectedLeftover)}
            </p>
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6" aria-labelledby="chart-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="chart-heading" className="text-lg font-bold text-ink">
              September so far
            </h2>
            <p className="text-sm text-inksoft">
              Money in vs money out. When the lines breathe apart, you're saving.
            </p>
          </div>
        </div>

        <div className="mt-5 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={IN_COLOR} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={IN_COLOR} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="out" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={OUT_COLOR} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={OUT_COLOR} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(228,234,240,0.9)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(v: number) => formatINRCompact(v).replace("₹", "")}
              />
              <Tooltip
                formatter={(value) => formatINR(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E4EAF0",
                  boxShadow: "0 8px 24px -12px rgba(0,41,112,0.25)",
                }}
              />
              <Area
                type="monotone"
                dataKey="moneyIn"
                stroke={IN_COLOR}
                strokeWidth={2.5}
                fill="url(#in)"
                name="Money in"
              />
              <Area
                type="monotone"
                dataKey="moneyOut"
                stroke={OUT_COLOR}
                strokeWidth={2}
                fill="url(#out)"
                name="Money out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* How to read */}
      <section className="mt-8 rounded-2xl bg-lighterblue p-5" aria-labelledby="read-heading">
        <h2 id="read-heading" className="text-lg font-bold text-ink">
          How to read this
        </h2>
        <ul className="mt-3 space-y-3 text-sm text-inksoft">
          <li className="flex gap-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-paytm" aria-hidden />
            <span>
              <strong className="text-ink">Money in</strong> is what customers actually
              paid — not orders, not promises.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warn" aria-hidden />
            <span>
              <strong className="text-ink">Commitments</strong> are already-fixed dates:
              rent, supplier, salary. HISAAB rings the bell before each one.
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" aria-hidden />
            <span>
              <strong className="text-ink">Leftover</strong> is what's genuinely safe to
              spend on growth — not your whole balance.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
