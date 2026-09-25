"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftRight, CalendarDays, Search } from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import { getTransactions, type TransactionQuery } from "@/lib/api/client";
import { usePageData } from "@/hooks/use-page-data";
import { cn, dateLabel, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import type { PaymentStatus, Transaction } from "@/types";

const STATUS_VARIANT: Record<PaymentStatus, "success" | "danger" | "warn" | "outline"> = {
  COMPLETED: "success",
  FAILED: "danger",
  PENDING: "warn",
  REFUNDED: "outline",
};

type RangeKey = "today" | "7d" | "30d" | "custom";
type ApiRange = TransactionQuery["range"];

const RANGE_OPTIONS: { label: string; value: RangeKey; apiValue: ApiRange }[] = [
  { label: "Today", value: "today", apiValue: "TODAY" },
  { label: "7 Days", value: "7d", apiValue: "7D" },
  { label: "30 Days", value: "30d", apiValue: "30D" },
  { label: "Custom", value: "custom", apiValue: "CUSTOM" },
];

const FILTER_OPTIONS = [
  { label: "All records", value: "ALL" },
  { label: "Income", value: "INCOME" },
  { label: "Refund", value: "REFUND_TYPE" },
  { label: "Settlement", value: "SETTLEMENT" },
  { label: "Failed", value: "FAILED" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
];

function normalizeRange(value: string | null): RangeKey {
  const normalized = value?.toLowerCase();
  if (normalized === "today" || normalized === "7d" || normalized === "custom") return normalized;
  if (normalized === "30d" || normalized === "30days") return "30d";
  return "30d";
}

function dateInputValue(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().slice(0, 10);
}

function rangeHref(range: RangeKey, from?: string, to?: string): string {
  const params = new URLSearchParams();
  params.set("range", range);
  if (range === "custom") {
    if (from) params.set("from", from);
    if (to) params.set("to", to);
  }
  return `/transactions?${params.toString()}`;
}

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const range = normalizeRange(searchParams.get("range"));
  const rangeMeta = RANGE_OPTIONS.find((option) => option.value === range) ?? RANGE_OPTIONS[2];
  const filter = FILTER_OPTIONS.some((option) => option.value === searchParams.get("status"))
    ? (searchParams.get("status") as TransactionQuery["status"])
    : "ALL";
  const from = searchParams.get("from") ?? dateInputValue(7);
  const to = searchParams.get("to") ?? dateInputValue(0);
  const [searchInput, setSearchInput] = React.useState(searchParams.get("q") ?? "");
  const [debounced, setDebounced] = React.useState(searchParams.get("q") ?? "");
  const [selected, setSelected] = React.useState<Transaction | null>(null);
  const [retriedIds, setRetriedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(searchInput), 250);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  React.useEffect(() => {
    const current = searchParams.get("q") ?? "";
    if (debounced === current) return;
    const next = new URLSearchParams(searchParams.toString());
    if (debounced) next.set("q", debounced);
    else next.delete("q");
    router.replace(`/transactions?${next.toString()}`, { scroll: false });
  }, [debounced, router, searchParams]);

  React.useEffect(() => {
    setSearchInput(searchParams.get("q") ?? "");
  }, [searchParams]);

  const { data, loading } = usePageData(
    () =>
      getTransactions({
        range: rangeMeta.apiValue,
        from: range === "custom" ? from : undefined,
        to: range === "custom" ? to : undefined,
        status: filter,
        search: debounced,
      }),
    [range, from, to, filter, debounced]
  );

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/transactions?${next.toString()}`, { scroll: false });
  };

  return (
    <div>
      <PageHeader title="Transactions" subtitle="Every rupee in and out — searchable." />

      <div className="flex flex-wrap items-center gap-3">
        <nav className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white p-1" aria-label="Transaction date range">
          {RANGE_OPTIONS.map((option) => {
            const active = option.value === range;
            return (
              <Link
                key={option.value}
                href={rangeHref(option.value, from, to)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                  active ? "bg-paytm-deep text-white" : "text-inksoft hover:bg-lighterblue hover:text-paytm-deep"
                )}
              >
                {option.label}
              </Link>
            );
          })}
        </nav>

        <Select
          className="w-40"
          options={FILTER_OPTIONS}
          value={filter}
          onChange={(event) => updateParam("status", event.target.value)}
          aria-label="Filter by type or status"
        />

        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-inksoft/70" aria-hidden />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search customer, category, amount…"
            aria-label="Search transactions"
            className="h-9 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm outline-none transition focus:border-paytm/60"
          />
        </div>
      </div>

      {range === "custom" && (
        <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-paytm/20 bg-lighterblue p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-paytm-deep">
            <CalendarDays className="size-4" aria-hidden /> Custom range
          </div>
          <label className="text-xs font-semibold text-inksoft">
            From
            <input
              type="date"
              value={from}
              onChange={(event) => updateParam("from", event.target.value)}
              className="mt-1 block rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-paytm/60"
            />
          </label>
          <label className="text-xs font-semibold text-inksoft">
            To
            <input
              type="date"
              value={to}
              onChange={(event) => updateParam("to", event.target.value)}
              className="mt-1 block rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-paytm/60"
            />
          </label>
          <p className="pb-2 text-xs text-inksoft">The table below is queried from the mock ledger.</p>
        </div>
      )}

      {data && (
        <p className="mt-4 text-xs font-semibold text-inksoft" aria-live="polite">
          {data.length} transactions
          {filter !== "ALL" && ` · ${FILTER_OPTIONS.find((option) => option.value === filter)?.label.toLowerCase()}`}
          {debounced && ` · matching “${debounced}”`}
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => <Skeleton key={index} className="h-10" />)}
          </div>
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions found"
            description="Try widening the date range or clearing the search."
            className="m-4 border-0 bg-transparent"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-line bg-lighterblue/60 text-left text-2xs font-bold uppercase tracking-widest text-inksoft/80">
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-3 py-3.5">Customer</th>
                  <th className="px-3 py-3.5 text-right">Amount</th>
                  <th className="px-3 py-3.5">Type</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5">Source</th>
                  <th className="px-5 py-3.5">Insight</th>
                </tr>
              </thead>
              <tbody>
                {data.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(index * 0.015, 0.3) }}
                    onClick={() => setSelected(transaction)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") setSelected(transaction);
                    }}
                    tabIndex={0}
                    role="button"
                    className="cursor-pointer border-b border-line/70 transition hover:bg-lighterblue focus:bg-lighterblue"
                  >
                    <td className="px-5 py-3 font-semibold text-ink">{dateLabel(transaction.date)}</td>
                    <td className="px-3 py-3">{transaction.customerName ?? <span className="text-inksoft/60">Walk-in</span>}</td>
                    <td className={cn("px-3 py-3 text-right font-bold tabular-nums", transaction.status === "FAILED" && "text-inksoft line-through opacity-70", transaction.status === "REFUNDED" && "text-inksoft")}>
                      {transaction.type === "REFUND" ? `−${formatINR(transaction.amount)}` : formatINR(transaction.amount)}
                    </td>
                    <td className="px-3 py-3 text-inksoft">{transaction.type}</td>
                    <td className="px-3 py-3"><Badge variant={STATUS_VARIANT[transaction.status]}>{transaction.status}</Badge></td>
                    <td className="px-3 py-3 text-inksoft">{transaction.paymentType}</td>
                    <td className="px-5 py-3 text-inksoft">{transaction.insight ?? "—"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DrawerContent>
          {selected && (
            <div className="flex-1 overflow-y-auto px-6 py-7">
              <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">Transaction</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-ink">{formatINR(selected.amount)}</p>
              <Badge variant={STATUS_VARIANT[selected.status]} className="mt-3">{selected.status}</Badge>

              <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
                {[
                  ["Date", dateLabel(selected.date)],
                  ["Time", selected.time],
                  ["Type", selected.type],
                  ["Payment source", selected.paymentType],
                  ["Customer", selected.customerName ?? "Walk-in"],
                  ["Customer type", selected.customerType ?? "—"],
                  ["Category", selected.category],
                  ["Reference", selected.id.toUpperCase()],
                ].map(([key, value]) => (
                  <div key={key} className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-inksoft">{key}</span>
                    <span className="font-semibold text-ink">{value}</span>
                  </div>
                ))}
              </div>

              {selected.insight && (
                <div className="mt-5 rounded-2xl border border-paytm/25 bg-lighterblue p-4">
                  <p className="text-2xs font-bold uppercase tracking-widest text-paytm-secondary">HISAAB insight</p>
                  <p className="mt-1 text-sm font-medium text-ink">{selected.insight}</p>
                </div>
              )}

              {selected.status === "FAILED" && (
                <div className="mt-5 rounded-2xl bg-paytm-deep p-4 text-white">
                  <p className="text-sm font-bold">This payment failed.</p>
                  <p className="mt-1 text-sm text-lightblue">It&apos;s part of the ₹2,100 failed-payment leakage. HISAAB can retry the collect automatically.</p>
                  <Button
                    className="mt-3 bg-white text-paytm-deep hover:bg-lightblue"
                    onClick={() => setRetriedIds((ids) => (ids.includes(selected.id) ? ids : [...ids, selected.id]))}
                  >
                    {retriedIds.includes(selected.id) ? "Retry queued" : "Retry payment"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <React.Suspense fallback={<div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-96 rounded-2xl" /></div>}>
      <TransactionsContent />
    </React.Suspense>
  );
}
