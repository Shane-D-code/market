"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Landmark, ShieldCheck, Sparkles, X } from "lucide-react";
import { getOpportunityBySlug } from "@/lib/api/client";
import { actionForOpportunity } from "@/lib/mock-data/actions";
import { usePageData } from "@/hooks/use-page-data";
import { formatINR, relativeTime } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBadge } from "@/features/shared/primitives";

export default function OpportunityDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: opportunity, loading } = usePageData(() => getOpportunityBySlug(slug), [slug]);
  const decide = useAppStore((state) => state.decide);
  const decisions = useAppStore((state) => state.decisions);
  const [confirm, setConfirm] = React.useState<"approve" | "reject" | null>(null);

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-48" /><Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div>;
  }

  if (!opportunity) {
    return (
      <div>
        <Link href="/protect" className="inline-flex items-center gap-2 text-sm font-semibold text-paytm-secondary hover:text-paytm-deep">
          <ArrowLeft className="size-4" aria-hidden /> Back to Protect
        </Link>
        <div className="mt-8 rounded-2xl border border-line bg-white p-8 text-center shadow-card">
          <h1 className="text-xl font-extrabold text-ink">Opportunity not found</h1>
          <p className="mt-2 text-sm text-inksoft">This opportunity may have expired or been moved.</p>
        </div>
      </div>
    );
  }

  const action = actionForOpportunity(opportunity.id);
  const actionId = action?.id ?? `opportunity_${opportunity.id}`;
  const decision = decisions[actionId];
  const status = decision === "APPROVED" ? "RUNNING" : decision === "REJECTED" ? "REJECTED" : action?.status;
  const canDecide = !status || status === "WAITING_APPROVAL";

  return (
    <div>
      <Link href="/protect" className="inline-flex items-center gap-2 text-sm font-semibold text-paytm-secondary hover:text-paytm-deep">
        <ArrowLeft className="size-4" aria-hidden /> Back to Protect
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant={opportunity.type === "GROW" ? "success" : opportunity.type === "OPTIMIZE" ? "warn" : "danger"}>{opportunity.type}</Badge>
        <Badge variant="outline">{opportunity.category}</Badge>
        {status && <Badge variant={status === "RUNNING" ? "warn" : status === "REJECTED" ? "danger" : status === "COMPLETED" ? "success" : "solid"}>{status.replaceAll("_", " ")}</Badge>}
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-ink lg:text-4xl">{opportunity.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-inksoft">{opportunity.description}</p>

          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-inksoft/80">
              <Sparkles className="size-4 text-paytm-secondary" aria-hidden /> Why this was flagged
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {opportunity.evidence.map((item) => (
                <div key={item.label} className="rounded-2xl border border-line bg-white p-4 shadow-card">
                  <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">{item.label}</p>
                  <p className="mt-1 text-sm font-bold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
            <ul className="mt-3 space-y-2">
              {opportunity.why.map((reason) => (
                <li key={reason} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-sm text-inksoft shadow-card">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-paytm" aria-hidden />
                  {reason}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-2xl bg-paytm-deep p-5 text-white sm:p-6">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lightblue">
              <ShieldCheck className="size-4" aria-hidden /> Recommended action
            </h2>
            <p className="mt-2 text-xl font-extrabold">{opportunity.recommendedAction}</p>
            {opportunity.actionPreview && <p className="mt-3 rounded-xl bg-white/10 p-4 text-sm leading-relaxed text-lightblue">“{opportunity.actionPreview}”</p>}
            {canDecide ? (
              <div className="mt-5 flex flex-wrap gap-2">
                <Button className="bg-white text-paytm-deep hover:bg-lightblue" onClick={() => setConfirm("approve")}><Check className="size-4" aria-hidden /> Approve & run</Button>
                <Button variant="outline" className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10" onClick={() => setConfirm("reject")}><X className="size-4" aria-hidden /> Dismiss</Button>
              </div>
            ) : (
              <p className="mt-5 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-lightblue">
                <Check className="size-4" aria-hidden /> {status === "REJECTED" ? "Dismissed. HISAAB will keep watching quietly." : "Approved. HISAAB will measure the outcome."}
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">At stake</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-paytm-deep">{formatINR(opportunity.impact)}</p>
            <div className="mt-3"><ConfidenceBadge value={opportunity.confidence} /></div>
            <p className="mt-4 text-xs text-inksoft">Detected {relativeTime(opportunity.detectedAt)}</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-inksoft/80"><Landmark className="size-4 text-paytm-secondary" aria-hidden /> Decision trace</h2>
            <p className="mt-2 text-sm leading-relaxed text-inksoft">Score = impact ({formatINR(opportunity.impact)}) × confidence ({opportunity.confidence}%) − risk ({opportunity.risk.toLowerCase()}).</p>
            {action?.resultSummary && <p className="mt-3 rounded-xl bg-lighterblue p-3 text-xs font-semibold text-inksoft">{action.resultSummary}</p>}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(open) => !open && setConfirm(null)}
        title={confirm === "reject" ? "Dismiss this opportunity?" : "Approve this action?"}
        description={confirm === "reject" ? "HISAAB will not prepare anything for this opportunity." : `HISAAB will ${opportunity.recommendedAction.toLowerCase()} and measure the outcome against ${formatINR(opportunity.impact)}.`}
        confirmLabel={confirm === "reject" ? "Dismiss" : "Approve"}
        tone={confirm === "reject" ? "danger" : "default"}
        onConfirm={() => {
          if (confirm === "approve") decide(actionId, "APPROVED");
          if (confirm === "reject") decide(actionId, "REJECTED");
        }}
      />
    </div>
  );
}
