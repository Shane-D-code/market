"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Trophy,
  XCircle,
  HelpCircle,
  Play,
  Square,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import { getExperiments } from "@/lib/api/client";
import { experimentHref } from "@/lib/mock-data/experiments";
import { usePageData } from "@/hooks/use-page-data";
import { formatINR, formatPercent } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Experiment } from "@/types";

function ControlTestBar({ exp }: { exp: Experiment }) {
  const max = Math.max(exp.controlValue, exp.testValue) || 1;
  const isMoney = exp.id !== "exp_bundle";
  const fmt = (v: number) => (isMoney ? formatINR(v) : `₹${v.toLocaleString("en-IN")}`);
  const metric = isMoney ? "revenue" : "avg order";

  return (
    <div className="space-y-2">
      <div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-inksoft">
            <span className="size-2 rounded-full bg-inksoft/50" aria-hidden /> Control
          </span>
          <span className="font-bold text-ink">
            {fmt(exp.controlValue)}{" "}
            <span className="font-medium text-inksoft">{metric}</span>
          </span>
        </div>
        <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-lightblue">
          <div
            className="h-full rounded-full bg-inksoft/50"
            style={{ width: `${(exp.controlValue / max) * 100}%` }}
          />
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-paytm-secondary">
            <span className="size-2 rounded-full bg-paytm" aria-hidden /> Test
          </span>
          <span className="font-bold text-paytm-deep">{fmt(exp.testValue)}</span>
        </div>
        <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-lightblue">
          <div
            className="h-full rounded-full bg-paytm"
            style={{ width: `${(exp.testValue / max) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ExperimentCard({
  exp,
  onStop,
  onContinue,
  continued,
  delay = 0,
}: {
  exp: Experiment;
  onStop: (e: Experiment) => void;
  onContinue: (e: Experiment) => void;
  continued: boolean;
  delay?: number;
}) {
  const running = exp.status === "RUNNING";
  const verdictMeta = {
    WIN: { icon: Trophy, variant: "success" as const, label: "WON" },
    FAILED: { icon: XCircle, variant: "danger" as const, label: "FAILED" },
    INCONCLUSIVE: { icon: HelpCircle, variant: "outline" as const, label: "INCONCLUSIVE" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-line bg-white p-5 shadow-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-lightblue">
            <FlaskConical className="size-4 text-paytm-secondary" aria-hidden />
          </span>
          <div>
            <Link href={experimentHref(exp.id)} className="text-base font-bold text-ink hover:text-paytm-secondary">
              {exp.name}
            </Link>
            <p className="text-xs text-inksoft">{exp.hypothesis}</p>
          </div>
        </div>
        {running ? (
          <Badge variant="warn">
            Day {exp.daysElapsed} / {exp.daysTotal}
          </Badge>
        ) : exp.verdict ? (
          <Badge variant={verdictMeta[exp.verdict].variant}>
            {verdictMeta[exp.verdict].label}
          </Badge>
        ) : (
          <Badge variant="outline">STOPPED</Badge>
        )}
      </div>

      <div className="mt-5">
        <ControlTestBar exp={exp} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-lighterblue p-3">
          <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
            Lift
          </p>
          <p
            className={`text-lg font-extrabold ${
              (exp.lift ?? 0) >= 5 ? "text-success" : (exp.lift ?? 0) >= 0 ? "text-warn" : "text-danger"
            }`}
          >
            {formatPercent(exp.lift ?? 0)}
          </p>
        </div>
        <div className="rounded-xl bg-lighterblue p-3">
          <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
            Confidence
          </p>
          <p className="text-lg font-extrabold text-ink">{exp.confidence ?? "—"}%</p>
        </div>
        <div className="rounded-xl bg-lighterblue p-3">
          <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
            {exp.marginImpact !== undefined ? "Margin impact" : "Revenue"}
          </p>
          <p
            className={`text-lg font-extrabold ${
              (exp.marginImpact ?? exp.revenueImpact ?? 0) >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {formatINR(exp.marginImpact ?? exp.revenueImpact ?? 0)}
          </p>
        </div>
      </div>

      {running && exp.daysTotal && exp.daysElapsed !== undefined && (
        <div className="mt-4">
          <Progress value={(exp.daysElapsed / exp.daysTotal) * 100} />
        </div>
      )}

      {/* Outcome → Learning */}
      {exp.recommendation && (
        <div className="mt-4 flex gap-2.5 rounded-xl border border-paytm/20 bg-lighterblue px-4 py-3">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-paytm-secondary" aria-hidden />
          <div>
            <p className="text-2xs font-bold uppercase tracking-widest text-paytm-secondary">
              What we learned
            </p>
            <p className="mt-0.5 text-sm font-semibold text-ink">
              {exp.recommendation}
              {exp.marginImpact !== undefined && exp.marginImpact < 0 && (
                <span className="font-normal text-inksoft">
                  {" "}
                  (+{formatPercent(exp.lift ?? 0)} volume,{" "}
                  {formatINR(exp.marginImpact)} margin)
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {running && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={experimentHref(exp.id)}>
              <BarChart3 className="size-3.5" aria-hidden /> View Results
            </Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onStop(exp)}>
            <Square className="size-3.5" aria-hidden /> Stop
          </Button>
          <Button size="sm" onClick={() => onContinue(exp)} disabled={continued}>
            <Play className="size-3.5" aria-hidden /> {continued ? "Continued" : "Continue"}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default function ExperimentsPage() {
  const { data, loading } = usePageData(getExperiments, []);
  const [stopping, setStopping] = React.useState<Experiment | null>(null);
  const [stoppedIds, setStoppedIds] = React.useState<string[]>([]);
  const [continuedIds, setContinuedIds] = React.useState<string[]>([]);

  const list = (data ?? []).map((e) =>
    stoppedIds.includes(e.id) ? { ...e, status: "STOPPED" as const } : e
  );
  const running = list.filter((e) => e.status === "RUNNING");
  const done = list.filter((e) => e.status !== "RUNNING");

  return (
    <div>
      <PageHeader
        title="Experiments"
        subtitle="Test what actually works."
      />

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No experiments yet"
          description="HISAAB will suggest experiments when there's enough evidence — a bundle, a price, a timing."
        />
      ) : (
        <>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-inksoft/80">
            Active
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
             {running.map((e, i) => (
               <ExperimentCard
                 key={e.id}
                 exp={e}
                 onStop={setStopping}
                 onContinue={(experiment) => setContinuedIds((ids) => ids.includes(experiment.id) ? ids : [...ids, experiment.id])}
                 continued={continuedIds.includes(e.id)}
                 delay={i * 0.05}
               />
             ))}
          </div>

          <h2 className="mb-4 mt-10 text-xs font-bold uppercase tracking-widest text-inksoft/80">
            Completed & stopped — HISAAB learns from each
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
             {done.map((e, i) => (
               <ExperimentCard
                 key={e.id}
                 exp={e}
                 onStop={setStopping}
                 onContinue={(experiment) => setContinuedIds((ids) => ids.includes(experiment.id) ? ids : [...ids, experiment.id])}
                 continued={continuedIds.includes(e.id)}
                 delay={i * 0.05}
               />
             ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={stopping !== null}
        onOpenChange={(o) => !o && setStopping(null)}
        title={`Stop “${stopping?.name}”?`}
        description="HISAAB will keep the results and fold what it learned into future recommendations."
        confirmLabel="Stop experiment"
        tone="danger"
        onConfirm={() => {
          if (stopping) setStoppedIds((ids) => [...ids, stopping.id]);
        }}
      />
    </div>
  );
}
