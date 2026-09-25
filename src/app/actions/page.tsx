"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, X, Clock, CheckCheck, Ban } from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import { getActions } from "@/lib/api/client";
import { filterActions } from "@/lib/mock-data/actions";
import { opportunityHref } from "@/lib/mock-data/opportunities";
import { experimentHref } from "@/lib/mock-data/experiments";
import { usePageData } from "@/hooks/use-page-data";
import { useAppStore, effectiveStatus } from "@/store/app-store";
import { formatINR, relativeTime, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
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

function normalizeFilter(value: string | null): ActionFilter {
  return FILTERS.some((filter) => filter.value === value) ? (value as ActionFilter) : "approval";
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
  const meta = STATUS_META[status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={action.opportunityId.startsWith("exp_") ? experimentHref(action.opportunityId) : opportunityHref(action.opportunityId)}
              className="text-base font-bold text-ink hover:text-paytm-secondary"
            >
              {action.title}
            </Link>
            <Badge variant={meta.variant}>{meta.label}</Badge>
          </div>
          <p className="mt-1 text-sm text-inksoft">
            {action.customersReached ? `${action.customersReached} customers` : "Prepared by HISAAB"} · {formatINR(status === "COMPLETED" ? (action.actualImpact ?? action.expectedImpact) : action.expectedImpact)} {status === "COMPLETED" ? "recovered" : "potential recovery"}
          </p>
          {action.resultSummary && <p className="mt-1.5 rounded-lg bg-lighterblue px-3 py-1.5 text-xs font-medium text-inksoft">{action.resultSummary}</p>}
        </div>
        <div className="flex items-center gap-2">
          {status === "WAITING_APPROVAL" ? (
            <>
              <Button size="sm" variant="destructive" onClick={() => onDecide(action.id, "REJECTED")}>
                <X className="size-3.5" aria-hidden /> Reject
              </Button>
              <Button size="sm" onClick={() => onDecide(action.id, "APPROVED")}>
                <Check className="size-3.5" aria-hidden /> Approve
              </Button>
            </>
          ) : (
            <span className="text-2xs text-muted">{relativeTime(action.completedAt ?? action.createdAt)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ActionsContent() {
  const searchParams = useSearchParams();
  const filter = normalizeFilter(searchParams.get("status"));
  const { data, loading } = usePageData(getActions, []);
  const store = useAppStore();
  const [confirming, setConfirming] = React.useState<{ id: string; d: "APPROVED" | "REJECTED" } | null>(null);

  const list = data ?? [];
  const statusFor = (action: Action) => effectiveStatus(action, store);
  const buckets = {
    approval: filterActions(list, "approval", statusFor),
    running: filterActions(list, "running", statusFor),
    completed: filterActions(list, "completed", statusFor),
    rejected: filterActions(list, "rejected", statusFor),
  };
  const activeItems = buckets[filter];
  const empty = {
    approval: { title: "Nothing waiting", description: "HISAAB has no actions pending your approval. New opportunities appear here the moment they're ready.", icon: CheckCheck },
    running: { title: "Nothing running", description: "Approved actions appear here while HISAAB executes and measures them.", icon: Clock },
    completed: { title: "No completed actions yet", description: "Finished actions land here with their measured results.", icon: CheckCheck },
    rejected: { title: "Nothing rejected", description: "Actions you declined are kept here for reference.", icon: Ban },
  }[filter];

  return (
    <div>
      <PageHeader title="Actions" subtitle="Everything HISAAB has recommended or executed." />

      <nav className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-white p-1" aria-label="Action status">
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

      <div className="mt-5">
        {loading ? (
          <div className="space-y-3">{[0, 1].map((index) => <Skeleton key={index} className="h-24 rounded-2xl" />)}</div>
        ) : activeItems.length === 0 ? (
          <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />
        ) : (
          <div className="space-y-3">
            {activeItems.map((action) => (
              <ActionRow key={action.id} action={action} status={effectiveStatus(action, store)} onDecide={(id, decision) => setConfirming({ id, d: decision })} />
            ))}
          </div>
        )}
      </div>

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
