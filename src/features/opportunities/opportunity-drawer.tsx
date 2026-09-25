"use client";

import * as React from "react";
import { Check, X, ShieldCheck, Sparkles, Landmark } from "lucide-react";
import type { Opportunity } from "@/types";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatINR } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { ConfidenceBadge } from "@/features/shared/primitives";

export function OpportunityDrawer({
  opportunity,
  open,
  onOpenChange,
}: {
  opportunity: Opportunity | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [confirm, setConfirm] = React.useState<null | "approve" | "reject">(null);
  const [sent, setSent] = React.useState(false);
  const decide = useAppStore((s) => s.decide);

  React.useEffect(() => {
    if (!open) {
      setConfirm(null);
      setSent(false);
    }
  }, [open]);

  if (!opportunity) return null;

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="flex-1 overflow-y-auto px-6 py-7">
            <div className="flex items-start gap-2">
              <Badge variant={opportunity.type === "GROW" ? "success" : opportunity.type === "OPTIMIZE" ? "warn" : "danger"}>
                {opportunity.type}
              </Badge>
              <Badge variant="outline">{opportunity.category}</Badge>
            </div>

            <h2 className="mt-4 pr-8 text-2xl font-extrabold tracking-tight text-ink">
              {opportunity.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-inksoft">
              {opportunity.description}
            </p>

            {/* WHAT — the money */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-line bg-white p-4">
              <div>
                <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
                  {opportunity.type === "GROW" ? "Expected impact" : "At stake"}
                </p>
                <p className="text-2xl font-extrabold tracking-tight text-paytm-deep">
                  {formatINR(opportunity.impact)}
                </p>
              </div>
              <ConfidenceBadge value={opportunity.confidence} />
            </div>

            {/* WHY — evidence */}
            <section className="mt-6">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-inksoft/80">
                <Sparkles className="size-3.5 text-paytm-secondary" aria-hidden />
                Why this was flagged
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {opportunity.evidence.map((e) => (
                  <div
                    key={e.label}
                    className="rounded-xl border border-line bg-white p-3.5"
                  >
                    <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
                      {e.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-ink">{e.value}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-3 space-y-2">
                {opportunity.why.map((w, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 rounded-xl bg-white p-3 text-sm text-inksoft shadow-card"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-paytm" aria-hidden />
                    {w}
                  </li>
                ))}
              </ul>
            </section>

            {/* ACTION */}
            <section className="mt-6 rounded-2xl bg-paytm-deep p-5 text-white">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lightblue">
                <ShieldCheck className="size-4" aria-hidden />
                Recommended action
              </h3>
              <p className="mt-2 text-lg font-bold">
                {opportunity.recommendedAction}
              </p>
              {opportunity.actionPreview && (
                <div className="mt-3 rounded-xl bg-white/10 p-3.5 text-sm leading-relaxed text-lightblue">
                  “{opportunity.actionPreview}”
                </div>
              )}

              {sent ? (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold">
                  <Check className="size-4" aria-hidden />
                  Approved — HISAAB will measure the outcome and report back.
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button className="bg-white text-paytm-deep hover:bg-lightblue" onClick={() => setConfirm("approve")}>
                    <Check className="size-4" aria-hidden /> Approve & Run
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
                    onClick={() => setConfirm("reject")}
                  >
                    <X className="size-4" aria-hidden /> Dismiss
                  </Button>
                </div>
              )}
            </section>

            {/* Decision transparency */}
            <section className="mt-6">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-inksoft/80">
                <Landmark className="size-3.5 text-paytm-secondary" aria-hidden />
                Why HISAAB recommended this
              </h3>
              <p className="mt-2 rounded-xl border border-line bg-white p-3.5 text-sm leading-relaxed text-inksoft">
                Score = impact ({formatINR(opportunity.impact)}) × confidence (
                {opportunity.confidence}%) − risk ({opportunity.risk.toLowerCase()}). It ranks
                first among today's options, and fits your current approval rules.
              </p>
            </section>
          </div>
        </DrawerContent>
      </Drawer>

      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={confirm === "reject" ? "Dismiss this opportunity?" : "Approve this action?"}
        description={
          confirm === "reject"
            ? "HISAAB will not prepare anything for this. It will keep watching the pattern quietly."
            : `HISAAB will ${opportunity.recommendedAction.toLowerCase()} and measure the outcome against the expected ${formatINR(opportunity.impact)}.`
        }
        confirmLabel={confirm === "reject" ? "Dismiss" : "Approve"}
        tone={confirm === "reject" ? "danger" : "default"}
        onConfirm={() => {
          if (confirm === "approve") {
            decide(`act_${opportunity.id.slice(-3)}`, "APPROVED");
            setSent(true);
          }
          if (confirm === "reject") {
            decide(`act_${opportunity.id.slice(-3)}`, "REJECTED");
            setSent(true);
          }
        }}
      />
    </>
  );
}
