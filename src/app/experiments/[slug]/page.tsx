"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BarChart3, Check, FlaskConical, Lightbulb, Play, Square, Trophy, XCircle } from "lucide-react";
import { getExperimentBySlug } from "@/lib/api/client";
import { usePageData } from "@/hooks/use-page-data";
import { dateLabel, formatINR, formatPercent, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExperimentDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data: experiment, loading } = usePageData(() => getExperimentBySlug(params.slug), [params.slug]);
  const [status, setStatus] = React.useState<"RUNNING" | "STOPPED" | "COMPLETED" | null>(null);
  const [stopping, setStopping] = React.useState(false);
  const [continued, setContinued] = React.useState(false);

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-52" /><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div>;
  }

  if (!experiment) {
    return (
      <div>
        <Link href="/experiments" className="inline-flex items-center gap-2 text-sm font-semibold text-paytm-secondary hover:text-paytm-deep"><ArrowLeft className="size-4" aria-hidden /> Back to Experiments</Link>
        <div className="mt-8 rounded-2xl border border-line bg-white p-8 text-center shadow-card">
          <h1 className="text-xl font-extrabold text-ink">Experiment not found</h1>
          <p className="mt-2 text-sm text-inksoft">This experiment may have been archived.</p>
        </div>
      </div>
    );
  }

  const currentStatus = status ?? experiment.status;
  const isRunning = currentStatus === "RUNNING";
  const max = Math.max(experiment.controlValue, experiment.testValue) || 1;
  const isMoney = experiment.id !== "exp_bundle";
  const formatMetric = (value: number) => isMoney ? formatINR(value) : `₹${value.toLocaleString("en-IN")}`;
  const verdict = experiment.verdict === "WIN" ? { icon: Trophy, label: "Won", tone: "success" as const } : experiment.verdict === "FAILED" ? { icon: XCircle, label: "Failed", tone: "danger" as const } : experiment.verdict ? { icon: Lightbulb, label: "Inconclusive", tone: "outline" as const } : null;

  return (
    <div>
      <Link href="/experiments" className="inline-flex items-center gap-2 text-sm font-semibold text-paytm-secondary hover:text-paytm-deep"><ArrowLeft className="size-4" aria-hidden /> Back to Experiments</Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-lightblue"><FlaskConical className="size-5 text-paytm-secondary" aria-hidden /></span>
            <Badge variant={isRunning ? "warn" : currentStatus === "COMPLETED" ? "success" : "outline"}>{currentStatus}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink lg:text-4xl">{experiment.name}</h1>
          <p className="mt-3 text-base leading-relaxed text-inksoft">{experiment.hypothesis}</p>
        </div>
        {verdict && <Badge variant={verdict.tone}><verdict.icon className="size-3.5" aria-hidden /> {verdict.label}</Badge>}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6" aria-labelledby="comparison-heading">
            <div className="flex items-center gap-2"><BarChart3 className="size-4 text-paytm-secondary" aria-hidden /><h2 id="comparison-heading" className="text-lg font-bold text-ink">Control vs test</h2></div>
            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between text-sm"><span className="font-semibold text-inksoft">Control · {isMoney ? "revenue" : "avg order"}</span><span className="font-bold text-ink">{formatMetric(experiment.controlValue)}</span></div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-lightblue"><div className="h-full rounded-full bg-inksoft/50" style={{ width: `${(experiment.controlValue / max) * 100}%` }} /></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm"><span className="font-semibold text-paytm-secondary">Test · {isMoney ? "revenue" : "avg order"}</span><span className="font-bold text-paytm-deep">{formatMetric(experiment.testValue)}</span></div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-lightblue"><div className="h-full rounded-full bg-paytm" style={{ width: `${(experiment.testValue / max) * 100}%` }} /></div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-lighterblue p-3"><p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">Lift</p><p className="mt-1 text-xl font-extrabold text-success">{formatPercent(experiment.lift ?? 0)}</p></div>
              <div className="rounded-xl bg-lighterblue p-3"><p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">Confidence</p><p className="mt-1 text-xl font-extrabold text-ink">{experiment.confidence ?? "—"}%</p></div>
              <div className="rounded-xl bg-lighterblue p-3"><p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">Impact</p><p className={cn("mt-1 text-xl font-extrabold", (experiment.marginImpact ?? experiment.revenueImpact ?? 0) >= 0 ? "text-success" : "text-danger")}>{formatINR(experiment.marginImpact ?? experiment.revenueImpact ?? 0)}</p></div>
            </div>
          </section>

          {isRunning && experiment.daysTotal && experiment.daysElapsed !== undefined && (
            <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-center justify-between text-sm"><span className="font-bold text-ink">Experiment progress</span><span className="text-inksoft">Day {experiment.daysElapsed} of {experiment.daysTotal}</span></div>
              <Progress className="mt-3" value={(experiment.daysElapsed / experiment.daysTotal) * 100} />
            </section>
          )}

          {experiment.recommendation && <section className="rounded-2xl border border-paytm/20 bg-lighterblue p-5"><div className="flex gap-3"><Lightbulb className="mt-0.5 size-5 shrink-0 text-paytm-secondary" aria-hidden /><div><h2 className="text-xs font-bold uppercase tracking-widest text-paytm-secondary">What we learned</h2><p className="mt-1 text-sm font-semibold text-ink">{experiment.recommendation}</p></div></div></section>}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">Run details</p>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-inksoft">Started</dt><dd className="font-semibold text-ink">{dateLabel(experiment.startDate)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-inksoft">Ends</dt><dd className="font-semibold text-ink">{dateLabel(experiment.endDate)}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-inksoft">Status</dt><dd className="font-semibold text-ink">{currentStatus}</dd></div>
            </dl>
          </div>
          <div className="rounded-2xl bg-paytm-deep p-5 text-white">
            <p className="text-sm font-bold">{isRunning ? "Keep the test running" : "Experiment complete"}</p>
            <p className="mt-1 text-sm leading-relaxed text-lightblue">{isRunning ? "HISAAB will keep comparing both groups and surface a verdict when the sample is meaningful." : "The result is linked to your impact record."}</p>
            {isRunning && <div className="mt-4 flex flex-wrap gap-2"><Button className="bg-white text-paytm-deep hover:bg-lightblue" onClick={() => setContinued(true)} disabled={continued}><Play className="size-4" aria-hidden /> {continued ? "Continued" : "Continue"}</Button><Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10" onClick={() => setStopping(true)}><Square className="size-4" aria-hidden /> Stop</Button></div>}
            {!isRunning && <Button asChild className="mt-4 w-full bg-white text-paytm-deep hover:bg-lightblue"><Link href="/impact"><ArrowUpRight className="size-4" aria-hidden /> See impact</Link></Button>}
          </div>
        </aside>
      </div>

      <ConfirmDialog open={stopping} onOpenChange={setStopping} title="Stop this experiment?" description="HISAAB will keep the results and fold what it learned into future recommendations." confirmLabel="Stop experiment" tone="danger" onConfirm={() => setStatus("STOPPED")} />
    </div>
  );
}
