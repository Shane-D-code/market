"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, HeartHandshake, UserCheck, UserPlus, UserX, Check, Users } from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import { getCustomers } from "@/lib/api/client";
import type { CustomerFilter } from "@/lib/mock-data/customers";
import { usePageData } from "@/hooks/use-page-data";
import { formatINR, formatDayLabel, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/features/shared/primitives";
import type { Customer } from "@/types";

const FILTERS: { key: CustomerFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "at-risk", label: "At Risk" },
  { key: "returning", label: "Returning" },
  { key: "recently-lost", label: "Recently Lost" },
  { key: "high-value", label: "High Value" },
];

const FILTER_TITLES: Record<CustomerFilter, string> = {
  all: "All customers worth knowing",
  "at-risk": "Customers worth bringing back",
  returning: "Returning customers",
  "recently-lost": "Recently lost customers",
  "high-value": "High-value customers",
};

function customerStatus(customer: Customer) {
  if (customer.status === "AT_RISK") return { label: "At risk", tone: "negative" as const };
  if (customer.status === "DORMANT") return { label: "Recently lost", tone: "neutral" as const };
  if (customer.estimatedValue >= 6000) return { label: "High value", tone: "positive" as const };
  return { label: "Returning", tone: "positive" as const };
}

function CustomerCard({
  customer,
  onWinBack,
  prepared,
  delay = 0,
}: {
  customer: Customer;
  onWinBack: (customer: Customer) => void;
  prepared: boolean;
  delay?: number;
}) {
  const status = customerStatus(customer);
  const isLate = customer.lastVisitDaysAgo > customer.typicalIntervalDays;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-lightblue text-sm font-bold text-paytm-deep">
            {customer.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
          </span>
          <div>
            <p className="text-base font-bold text-ink">{customer.name}</p>
            <p className="text-xs text-inksoft">{customer.segment}</p>
          </div>
        </div>
        <StatusBadge label={status.label} tone={status.tone} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/60">Usually returns every</p>
          <p className="font-bold text-ink">{customer.typicalIntervalDays} days</p>
        </div>
        <div>
          <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/60">Last purchase</p>
          <p className="font-bold text-ink">{formatDayLabel(customer.lastVisitDaysAgo)}</p>
        </div>
        <div>
          <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/60">Return signal</p>
          <p className={cn("font-bold", isLate ? "text-danger" : "text-success")}>
            {isLate ? `+${customer.lastVisitDaysAgo - customer.typicalIntervalDays} days late` : "On schedule"}
          </p>
        </div>
        <div>
          <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/60">Estimated value</p>
          <p className="font-bold text-paytm-deep">{formatINR(customer.estimatedValue)}</p>
        </div>
      </div>

      <div className="mt-auto pt-4">
        {prepared ? (
          <div className="flex items-center gap-2 rounded-lg bg-successsoft px-4 py-2 text-sm font-bold text-success">
            <Check className="size-4" aria-hidden /> Win-back queued
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => onWinBack(customer)}>
            <HeartHandshake className="size-4" aria-hidden />
            {customer.status === "DORMANT" ? "Prepare win-back" : "Take Action"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

function CustomersContent() {
  const searchParams = useSearchParams();
  const queryFilter = searchParams.get("filter") ?? searchParams.get("segment");
  const filter: CustomerFilter = FILTERS.some((item) => item.key === queryFilter)
    ? (queryFilter as CustomerFilter)
    : "all";
  const { data, loading } = usePageData(() => getCustomers(filter), [filter]);
  const [target, setTarget] = React.useState<Customer | null>(null);
  const [preparedIds, setPreparedIds] = React.useState<string[]>([]);
  const maxDist = Math.max(...(data?.distribution ?? [{ customers: 1 }]).map((item) => item.customers));

  return (
    <div>
      <PageHeader title="Customers" subtitle="Not a CRM — the customers who move your numbers." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Returning customers", value: data?.returning ?? 0, icon: UserCheck, tone: "text-success" },
          { label: "At risk", value: data?.atRisk ?? 0, icon: UserX, tone: "text-danger" },
          { label: "High value", value: data?.highValueCount ?? 0, icon: Crown, tone: "text-paytm-deep" },
          { label: "New this month", value: data?.newThisMonth ?? 0, icon: UserPlus, tone: "text-ink" },
        ].map((item, index) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-line bg-white p-4 shadow-card">
            <div className="flex items-center gap-2">
              <item.icon className={`size-4 ${item.tone}`} aria-hidden />
              <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/80">{item.label}</p>
            </div>
            <p className={`mt-2 text-2xl font-extrabold tracking-tight lg:text-3xl ${item.tone}`}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {data && (
        <section className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-card" aria-labelledby="dist-heading">
          <h2 id="dist-heading" className="text-lg font-bold text-ink">How quickly customers come back</h2>
          <p className="mt-1 text-sm text-inksoft">Most regulars return within 12–14 days. Anything beyond 18 gets flagged.</p>
          <div className="mt-5 flex items-end gap-2 sm:gap-3">
            {data.distribution.map((item, index) => (
              <div key={item.days} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-2xs font-bold text-inksoft">{item.customers}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.customers / maxDist) * 120}px` }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                  className={`w-full max-w-10 rounded-t-lg ${item.days >= 18 ? "bg-danger" : "bg-paytm"}`}
                  style={{ minHeight: 6 }}
                />
                <span className="text-2xs text-inksoft/70">{item.days}d</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10" aria-labelledby="customer-list-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="customer-list-heading" className="text-2xl font-extrabold tracking-tight text-ink">{FILTER_TITLES[filter]}</h2>
            <p className="mt-1 text-sm text-inksoft">Choose a segment to change the dataset HISAAB is showing.</p>
          </div>
          <nav className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white p-1" aria-label="Customer segments">
            {FILTERS.map((item) => {
              const active = item.key === filter;
              const href = item.key === "all" ? "/customers" : `/customers?filter=${item.key}`;
              return (
                <Link
                  key={item.key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
                    active ? "bg-paytm-deep text-white" : "text-inksoft hover:bg-lighterblue hover:text-paytm-deep"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {loading ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => <Skeleton key={index} className="h-60 rounded-2xl" />)}
          </div>
        ) : (data?.visibleCustomers ?? []).length === 0 ? (
          <EmptyState icon={Users} title="No customers in this segment" description="Try another segment or refresh the connected Paytm data." />
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {(data?.visibleCustomers ?? []).map((customer, index) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                delay={index * 0.04}
                prepared={preparedIds.includes(customer.id)}
                onWinBack={setTarget}
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title={`Win back ${target?.name ?? "customer"}?`}
        description="HISAAB will prepare a personalized message using their favorite items and usual return pattern."
        confirmLabel="Prepare win-back"
        onConfirm={() => {
          if (target) setPreparedIds((ids) => (ids.includes(target.id) ? ids : [...ids, target.id]));
        }}
      />
    </div>
  );
}

export default function CustomersPage() {
  return (
    <React.Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((index) => <Skeleton key={index} className="h-60 rounded-2xl" />)}</div>}>
      <CustomersContent />
    </React.Suspense>
  );
}
