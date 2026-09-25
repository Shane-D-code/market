"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  CircleEllipsis,
  RotateCcw,
  ShieldAlert,
  Users,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import { formatINR, formatPercent } from "@/lib/utils";
import { getOpportunities } from "@/lib/api/client";
import { opportunityHref } from "@/lib/mock-data/opportunities";
import { usePageData } from "@/hooks/use-page-data";
import { MetricCard } from "@/features/shared/metric-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const LEAKAGE = [
  {
    key: "opp_001",
    icon: Users,
    label: "Customer churn",
    amount: 11500,
    trend: -12.5,
    confidence: 87,
    action: "Win-back 6 overdue regulars",
  },
  {
    key: "opp_002",
    icon: XCircle,
    label: "Failed payments",
    amount: 2100,
    trend: 45,
    confidence: 92,
    action: "Auto-retry declined UPI collects",
  },
  {
    key: "opp_003",
    icon: BadgeCheck,
    label: "Discount leakage",
    amount: 3200,
    trend: 0,
    confidence: 81,
    action: "Reduce discount exposure",
  },
  {
    key: "opp_004",
    icon: RotateCcw,
    label: "Refunds",
    amount: 950,
    trend: -8.3,
    confidence: 74,
    action: "Check the 2 refunded batches",
  },
  {
    key: "opp_005",
    icon: CircleEllipsis,
    label: "Other anomalies",
    amount: 650,
    trend: -3.1,
    confidence: 61,
    action: "HISAAB keeps watching",
  },
];

export default function ProtectPage() {
  const { data, loading } = usePageData(getOpportunities, []);
  const byId = new Map((data ?? []).map((opportunity) => [opportunity.id, opportunity]));
  const total = LEAKAGE.reduce((sum, item) => sum + item.amount, 0);
  const max = Math.max(...LEAKAGE.map((item) => item.amount));

  return (
    <div>
      <PageHeader title="Protect your revenue" subtitle="Find leakage before it becomes permanent." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Revenue at Risk" value={formatINR(total)} meaning="Recoverable before it becomes permanent" href="/protect" tone="warning" delay={0.02} />
        <MetricCard
          label="Recoverable Revenue"
          value={formatINR(4200)}
          meaning="From the highest-confidence win-back"
          href="/protect/opportunities/revenue-recovery"
          delay={0.06}
        />
        <MetricCard label="Customers at Risk" value="6" meaning="Regulars outside their usual return window" href="/customers" delay={0.1} />
        <MetricCard label="Revenue Recovered" value={formatINR(42600)} meaning="Measured across completed actions" href="/impact" tone="success" delay={0.14} />
      </div>

      <section className="mt-10" aria-labelledby="leakage-heading">
        <div className="mb-5">
          <h2 id="leakage-heading" className="text-2xl font-extrabold tracking-tight text-ink">Revenue leakage</h2>
          <p className="mt-1 text-sm text-inksoft">{formatINR(18400)} this month · where it goes and what to do.</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          {LEAKAGE.map((item, index) => {
            const opportunity = byId.get(item.key);
            const content = (
              <div className="group block w-full rounded-xl px-2 py-3.5 text-left transition hover:bg-lighterblue">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <item.icon className="size-4 shrink-0 text-paytm-secondary/80" aria-hidden />
                    <span className="truncate text-sm font-bold text-ink">{item.label}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-ink">{formatINR(item.amount)}</span>
                    <span
                      className={`hidden w-14 text-right text-xs font-semibold sm:block ${
                        item.trend > 0 ? "text-danger" : item.trend < 0 ? "text-success" : "text-muted"
                      }`}
                    >
                      {item.trend === 0 ? "—" : formatPercent(item.trend)}
                    </span>
                    <ChevronRight className="size-4 text-inksoft/50 transition group-hover:translate-x-0.5 group-hover:text-paytm-deep" aria-hidden />
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-lightblue">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.amount / max) * 100}%` }}
                    transition={{ delay: 0.15 + index * 0.06, duration: 0.5 }}
                    className={`h-full rounded-full ${item.label === "Customer churn" ? "bg-paytm" : "bg-paytm/60"}`}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-2xs text-inksoft">
                  <Badge variant="outline">{item.confidence}% confidence</Badge>
                  <span className="font-medium text-paytm-secondary">{item.action}</span>
                </div>
              </div>
            );

            return (
              <motion.div key={item.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }}>
                {opportunity ? <Link href={opportunityHref(opportunity.id)}>{content}</Link> : content}
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="flagged-heading">
        <h2 id="flagged-heading" className="mb-5 text-2xl font-extrabold tracking-tight text-ink">Flagged for you</h2>
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((index) => <Skeleton key={index} className="h-20 rounded-2xl" />)}
          </div>
        ) : (data ?? []).filter((opportunity) => opportunity.type !== "GROW").length === 0 ? (
          <EmptyState icon={ShieldAlert} title="No revenue leakage detected" description="Everything looks normal right now. HISAAB keeps watching patterns and will alert you the moment something changes." />
        ) : (
          <div className="space-y-3">
            {(data ?? [])
              .filter((opportunity) => opportunity.type !== "GROW")
              .map((opportunity, index) => (
                <motion.div key={opportunity.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link href={opportunityHref(opportunity.id)} className="flex w-full flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-4 text-left shadow-card transition hover:shadow-pop">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-ink">{opportunity.title}</p>
                      <p className="truncate text-sm text-inksoft">{opportunity.description}</p>
                    </div>
                    <Badge variant={opportunity.risk === "HIGH" ? "danger" : opportunity.risk === "MEDIUM" ? "warn" : "outline"}>{opportunity.risk} RISK</Badge>
                    <span className="rounded-lg border border-paytm/50 px-3.5 py-2 text-xs font-semibold text-paytm-deep">Why?</span>
                  </Link>
                </motion.div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
