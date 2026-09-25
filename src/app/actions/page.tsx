"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Ban,
  Check,
  CheckCheck,
  Clock,
  CreditCard,
  FlaskConical,
  ListFilter,
  Package,
  Search,
  Settings2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import { MetricCard } from "@/features/shared/metric-card";
import { getActions } from "@/lib/api/client";
import { filterActions } from "@/lib/mock-data/actions";
import { opportunityHref } from "@/lib/mock-data/opportunities";
import { experimentHref } from "@/lib/mock-data/experiments";
import { usePageData } from "@/hooks/use-page-data";
import { useAppStore, effectiveStatus } from "@/store/app-store";
import { formatINR, relativeTime, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Action } from "@/types";
import type { LucideIcon } from "lucide-react";

const FILTERS = [
  { value: "approval", label: "Needs Approval" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
] as const;

type ActionFilter = (typeof FILTERS)[number]["value"];

const STATUS_META: Record<
  Action["status"],
  { label: string; variant: "solid" | "warn" | "success" | "danger" | "outline" }
> = {
  WAITING_APPROVAL: { label: "Needs approval", variant: "solid" },
  RUNNING: { label: "Running", variant: "warn" },
  COMPLETED: { label: "Completed", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
};

const ACTION_TYPE_META: Record<
  Action["type"],
  { label: string; icon: LucideIcon; variant: "default" | "outline" | "blue" | "success" | "warn" }
> = {
  WIN_BACK: { label: "Win-back", icon: Users, variant: "blue" },
  PAYMENT_RECOVERY: { label: "Payment recovery", icon: CreditCard, variant: "warn" },
  STOCK_ALERT: { label: "Stock alert", icon: Package, variant: "outline" },
  EXPERIMENT: { label: "Experiment", icon: FlaskConical, variant: "success" },
  BUNDLE: { label: "Bundle", icon: Package, variant: "default" },
};

const FILTER_COPY: Record<
  ActionFilter,
  {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyIcon: LucideIcon;
    emptyHref: string;
    emptyLabel: string;
  }
> = {
  approval: {
    title: "Needs your approval",
    description: "Review the evidence, then decide what HISAAB should execute next.",
    emptyTitle: "Nothing waiting",
    emptyDescription: "You are caught up. New recommendations will appear here when HISAAB finds a worthwhile next step.",
    emptyIcon: CheckCheck,
    emptyHref: "/protect",
    emptyLabel: "Review opportunities",
  },
  running: {
    title: "Actions in flight",
    description: "Approved actions are being prepared and measured against their expected impact.",
    emptyTitle: "Nothing running",
    emptyDescription: "Approve a recommendation to see its execution and measurement here.",
    emptyIcon: Clock,
    emptyHref: "/grow",
    emptyLabel: "Explore growth",
  },
  completed: {
    title: "Completed actions",
    description: "Finished actions with their measured results and recovery against target.",
    emptyTitle: "No completed actions yet",
    emptyDescription: "Once an action finishes, its result and measured impact will land here.",
    emptyIcon: CheckCheck,
    emptyHref: "/impact",
    emptyLabel: "View impact",
  },
  rejected: {
    title: "Rejected actions",
    description: "A record of recommendations you chose not to run right now.",
    emptyTitle: "Nothing rejected",
    emptyDescription: "Declined recommendations are kept here so you can revisit them later.",
    emptyIcon: Ban,
    emptyHref: "/settings",
    emptyLabel: "Review settings",
  },
};

const TYPE_OPTIONS = [
  { label: "All action types", value: "ALL" },
  { label: "Win-back", value: "WIN_BACK" },
  { label: "Payment recovery", value: "PAYMENT_RECOVERY" },
  { label: "Stock alert", value: "STOCK_ALERT" },
  { label: "Experiment", value: "EXPERIMENT" },
  { label: "Bundle", value: "BUNDLE" },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Highest impact", value: "impact" },
];

function normalizeFilter(value: string | null): ActionFilter {
  return FILTERS.some((filter) => filter.value === value) ? (value as ActionFilter) : "approval";
}

function actionAmount(action: Action, status: Action["status"]): number {
  return status === "COMPLETED" ? action.actualImpact ?? action.expectedImpact : action.expectedImpact;
}

function actionHref(action: Action): string {
  return action.opportunityId.startsWith("exp_")
    ? experimentHref(action.opportunityId)
    : opportunityHref(action.opportunityId);
}

function ActionRow({
  action,
  status,
  onDecide,
}: {
  action: Action;
  status: Action["status"];
  onDecide: (id: string, d: "APPROVED" | "REJECTED") => void;
}) {
  const statusMeta = STATUS_META[status];
  const typeMeta = ACTION_TYPE_META[action.type];
  const TypeIcon = typeMeta.icon;
  const href = actionHref(action);
  const amount = actionAmount(action, status);
  const completion = status === "COMPLETED" && action.expectedImpact > 0
    ? Math.min(100, Math.round((amount / action.expectedImpact) * 100))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-line bg-white p-4 shadow-card transition hover:border-paytm/20 hover:shadow-pop sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={typeMeta.variant}>
              <TypeIcon className="size-3" aria-hidden />
              {typeMeta.label}
            </Badge>
            <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
            <span className="text-2xs text-muted">Created {relativeTime(action.createdAt)}</span>
          </div>
          <Link href={href} className="mt-3 inline-flex max-w-full items-start gap-1.5 text-base font-bold text-ink hover:text-paytm-secondary">
            <span>{action.title}</span>
            <ArrowUpRight className="mt-0.5 size-4 shrink-0" aria-hidden />
          </Link>
          <p className="mt-1 text-sm text-inksoft">
            {action.customersReached ? `${action.customersReached} customers reached` : "Account-wide action"}
            <span className="mx-1.5 text-line">·</span>
            {status === "COMPLETED" ? "Measured against target" : status === "REJECTED" ? "Declined potential" : "Potential recovery"}
          </p>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
            {status === "COMPLETED" ? "Recovered" : status === "REJECTED" ? "Declined" : "Expected"}
          </p>
          <p className={cn("mt-1 text-2xl font-extrabold tracking-tight", status === "COMPLETED" ? "text-success" : "text-paytm-deep")}>
            {formatINR(amount)}
          </p>
          {completion !== null && <p className="mt-1 text-2xs font-semibold text-inksoft">{completion}% of {formatINR(action.expectedImpact)} target</p>}
        </div>
      </div>

      {action.resultSummary && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-lighterblue px-3.5 py-3 text-sm font-medium text-inksoft">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-paytm-secondary" aria-hidden />
          <span>{action.resultSummary}</span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex flex-wrap items-center gap-3 text-2xs font-medium text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden />
            {action.customersReached ? `${action.customersReached} reached` : "No audience limit"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {status === "COMPLETED" ? `Finished ${relativeTime(action.completedAt ?? action.createdAt)}` : `Queued ${relativeTime(action.createdAt)}`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={href} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-paytm-secondary hover:bg-lightblue hover:text-paytm-deep">
            View details <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
          {status === "WAITING_APPROVAL" && (
            <>
              <Button size="sm" variant="destructive" onClick={() => onDecide(action.id, "REJECTED")}>
                <X className="size-3.5" aria-hidden /> Reject
              </Button>
              <Button size="sm" onClick={() => onDecide(action.id, "APPROVED")}>
                <Check className="size-3.5" aria-hidden /> Approve
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ActionsContent() {
  const searchParams = useSearchParams();
  const filter = normalizeFilter(searchParams.get("status") ?? searchParams.get("tab"));
  const { data, loading } = usePageData(getActions, []);
  const store = useAppStore();
  const [confirming, setConfirming] = React.useState<{ id: string; d: "APPROVED" | "REJECTED" } | null>(null);
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"ALL" | Action["type"]>("ALL");
  const [sort, setSort] = React.useState<"newest" | "impact">("newest");

  const list = data ?? [];
  const statusFor = (action: Action) => effectiveStatus(action, store);
  const buckets = {
    approval: filterActions(list, "approval", statusFor),
    running: filterActions(list, "running", statusFor),
    completed: filterActions(list, "completed", statusFor),
    rejected: filterActions(list, "rejected", statusFor),
  };
  const activeItems = buckets[filter];
  const copy = FILTER_COPY[filter];
  const pendingValue = buckets.approval.reduce((sum, action) => sum + action.expectedImpact, 0);
  const runningValue = buckets.running.reduce((sum, action) => sum + action.expectedImpact, 0);
  const recoveredValue = buckets.completed.reduce((sum, action) => sum + (action.actualImpact ?? 0), 0);
  const completedTarget = buckets.completed.reduce((sum, action) => sum + action.expectedImpact, 0);
  const recoveryRate = completedTarget > 0 ? Math.round((recoveredValue / completedTarget) * 100) : 0;

  const visibleItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = activeItems.filter((action) => {
      const matchesType = typeFilter === "ALL" || action.type === typeFilter;
      const haystack = [action.title, action.type, action.resultSummary ?? ""].join(" ").toLowerCase();
      return matchesType && (!normalizedQuery || haystack.includes(normalizedQuery));
    });

    return [...filtered].sort((a, b) => {
      if (sort === "impact") {
        return actionAmount(b, statusFor(b)) - actionAmount(a, statusFor(a));
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [activeItems, query, sort, statusFor, typeFilter]);

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("ALL");
    setSort("newest");
  };

  return (
    <div>
      <PageHeader
        title="Actions"
        subtitle="Everything HISAAB has recommended or executed."
        right={(
          <Link href="/settings" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "whitespace-nowrap")}>
            <Settings2 className="size-4" aria-hidden /> Automation rules
          </Link>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pending decisions" value={String(buckets.approval.length)} meaning={`${formatINR(pendingValue)} potential recovery`} tone="warning" href="/actions?status=approval" delay={0.02} />
        <MetricCard label="In flight" value={String(buckets.running.length)} meaning={`${formatINR(runningValue)} expected impact`} tone="paytm" href="/actions?status=running" delay={0.06} />
        <MetricCard label="Recovered" value={formatINR(recoveredValue)} meaning="Measured from completed actions" tone="success" href="/impact" delay={0.1} />
        <MetricCard label="Recovery rate" value={`${recoveryRate}%`} meaning={`${formatINR(recoveredValue)} of ${formatINR(completedTarget)} target`} tone="neutral" delay={0.14} />
      </div>

      {buckets.approval.length > 0 && (
        <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-paytm/20 bg-lighterblue p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5" aria-label="Approval reminder">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-paytm-secondary shadow-sm">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-2xs font-bold uppercase tracking-widest text-paytm-secondary">Next best step</p>
              <p className="mt-1 text-sm font-bold text-ink">{buckets.approval.length} {buckets.approval.length === 1 ? "action is" : "actions are"} ready for your decision.</p>
              <p className="mt-0.5 text-xs text-inksoft">Review the evidence before HISAAB spends anything or contacts a customer.</p>
            </div>
          </div>
          <Link href="/protect" className={cn(buttonVariants({ size: "sm" }), "shrink-0")}>
            Review evidence <ArrowRight className="size-4" aria-hidden />
          </Link>
        </section>
      )}

      <nav className="mt-8 flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white p-1" aria-label="Action status">
        {FILTERS.map((item) => {
          const active = item.value === filter;
          const href = item.value === "approval" ? "/actions" : `/actions?status=${item.value}`;
          const count = buckets[item.value].length;
          return (
            <Link
              key={item.value}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                active ? "bg-paytm-deep text-white" : "text-inksoft hover:bg-lighterblue hover:text-paytm-deep"
              )}
            >
              {item.label}
              {count > 0 && <span className={cn("ml-1 rounded-full px-1.5 text-2xs font-bold", active ? "bg-white/20" : "bg-lightblue text-paytm-deep")}>{count}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-line bg-white p-3 shadow-card sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <ListFilter className="ml-1 size-4 shrink-0 text-paytm-secondary" aria-hidden />
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-inksoft" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search actions..."
              aria-label="Search actions"
              className="h-10 w-full rounded-full border border-line bg-lighterblue/40 pl-9 pr-9 text-sm text-ink outline-none transition placeholder:text-inksoft/70 focus:border-paytm/50 focus:bg-white"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear action search" className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-inksoft hover:bg-white hover:text-ink">
                <X className="size-3.5" aria-hidden />
              </button>
            )}
          </div>
        </div>
        <div className="w-full sm:w-44">
          <Select aria-label="Filter by action type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "ALL" | Action["type"])} options={TYPE_OPTIONS} />
        </div>
        <div className="w-full sm:w-44">
          <Select aria-label="Sort actions" value={sort} onChange={(event) => setSort(event.target.value as "newest" | "impact")} options={SORT_OPTIONS} />
        </div>
      </div>

      <section className="mt-7" aria-labelledby="action-list-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="action-list-heading" className="text-xl font-extrabold tracking-tight text-ink">{copy.title}</h2>
            <p className="mt-1 text-sm text-inksoft">{copy.description}</p>
          </div>
          <p className="text-xs font-semibold text-inksoft">{visibleItems.length} of {activeItems.length} {activeItems.length === 1 ? "action" : "actions"}</p>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">{[0, 1, 2].map((index) => <Skeleton key={index} className="h-44 rounded-2xl" />)}</div>
          ) : visibleItems.length === 0 ? (
            <EmptyState
              icon={activeItems.length > 0 ? Search : copy.emptyIcon}
              title={activeItems.length > 0 ? "No matching actions" : copy.emptyTitle}
              description={activeItems.length > 0 ? "Try a different search, action type, or sort order." : copy.emptyDescription}
              action={activeItems.length > 0 ? (
                <Button variant="outline" onClick={resetFilters}>Clear filters</Button>
              ) : (
                <Link href={copy.emptyHref} className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
                  {copy.emptyLabel} <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            />
          ) : (
            <div className="space-y-3">
              {visibleItems.map((action) => (
                <ActionRow key={action.id} action={action} status={statusFor(action)} onDecide={(id, decision) => setConfirming({ id, d: decision })} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-paytm-deep p-5 text-white shadow-pop sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lightblue">
            <Sparkles className="size-4" aria-hidden /> Decision loop
          </div>
          <h2 className="mt-3 text-xl font-extrabold">Nothing runs without your context.</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-lightblue">Open any action to see the evidence, expected impact, and the exact next step HISAAB will take.</p>
          <Link href="/protect" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-lightblue">
            Browse opportunity evidence <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-paytm-secondary">
            <Settings2 className="size-4" aria-hidden /> Guardrails
          </div>
          <h2 className="mt-3 text-lg font-extrabold text-ink">You stay in control.</h2>
          <p className="mt-2 text-sm leading-relaxed text-inksoft">HISAAB only executes approved actions and keeps the measurement trail in one place.</p>
          <Link href="/settings" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-paytm-secondary hover:text-paytm-deep">
            Review automation settings <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <ConfirmDialog
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
        title={confirming?.d === "APPROVED" ? "Approve this action?" : "Reject this action?"}
        description={confirming?.d === "APPROVED" ? "HISAAB will execute it within your rules and measure the outcome." : "HISAAB won't prepare this again unless the pattern re-appears."}
        confirmLabel={confirming?.d === "APPROVED" ? "Approve" : "Reject"}
        tone={confirming?.d === "APPROVED" ? "default" : "danger"}
        onConfirm={() => {
          if (confirming) store.decide(confirming.id, confirming.d);
        }}
      />
    </div>
  );
}

export default function ActionsPage() {
  return (
    <React.Suspense fallback={<div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-24 rounded-2xl" /></div>}>
      <ActionsContent />
    </React.Suspense>
  );
}
