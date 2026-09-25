"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X, ArrowDown, ShieldCheck, Workflow, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

type NodeKey =
  | "paytm"
  | "fastapi"
  | "events"
  | "db"
  | "analytics"
  | "cognee1"
  | "llm"
  | "protectgrow"
  | "jev"
  | "n8n"
  | "outcome"
  | "cognee2";

interface Node {
  key: NodeKey;
  label: string;
  sub: string;
  detail: {
    what: string;
    points: string[];
    formula?: string[];
  };
}

const NODES: Node[] = [
  {
    key: "paytm",
    label: "PAYTM",
    sub: "Transactions · settlements · refunds · payment status",
    detail: {
      what: "The raw ground truth of the business.",
      points: [
        "Paytm merchant APIs stream transactions, payment statuses and settlements.",
        "Business profile data (hours, categories, catalogue) enriches events.",
        "Everything downstream is only as good as this — no manual data entry for the merchant.",
      ],
    },
  },
  {
    key: "fastapi",
    label: "API / WEBHOOK → FASTAPI",
    sub: "Ingestion & serving layer",
    detail: {
      what: "The backend gateway between Paytm and HISAAB's intelligence.",
      points: [
        "Receives webhooks and event batches; validates with Pydantic.",
        "Serves the opportunity, action and outcome endpoints this frontend consumes.",
        "Stateless workers; Postgres for state, Redis for hot aggregates.",
      ],
    },
  },
  {
    key: "events",
    label: "EVENT NORMALIZATION",
    sub: "Normalize · dedupe · aggregate",
    detail: {
      what: "Turns raw events into merchant-meaningful signals.",
      points: [
        "Deduplicates retried webhooks, normalizes amount/status/category.",
        "Rolling aggregates: daily revenue, basket size, payment-mode mix, return intervals.",
        "Anomaly detectors flag failed-payment spikes and demand surges.",
      ],
    },
  },
  {
    key: "db",
    label: "POSTGRESQL / REDIS",
    sub: "State · hot aggregates",
    detail: {
      what: "Durable memory and fast lookups.",
      points: [
        "Postgres holds the normalized ledger, opportunities, actions and outcomes.",
        "Redis serves rolling aggregates and rate-limits action workflows.",
        "Python analytics jobs compute leakage, risk and projected leftover.",
      ],
    },
  },
  {
    key: "analytics",
    label: "PYTHON ANALYTICS",
    sub: "Quantify everything",
    detail: {
      what: "Where raw patterns become rupee-denominated insights.",
      points: [
        "Return-interval models per customer (mean, spread, drift).",
        "Leakage decomposition: churn, failed payments, discounts, refunds.",
        "Cash-flow projection from dated commitments and revenue seasonality.",
      ],
    },
  },
  {
    key: "cognee1",
    label: "COGNEE",
    sub: "Merchant memory (write path)",
    detail: {
      what: "The merchant's business memory — patterns, not rows.",
      points: [
        "Builds an entity graph: customers, products, time-of-day rhythms, return intervals.",
        "Stores learned facts like 'regulars return every 12–14 days'.",
        "This memory is what makes HISAAB's explanations specific, not generic.",
      ],
    },
  },
  {
    key: "llm",
    label: "LLM",
    sub: "Explanations & opportunity detection",
    detail: {
      what: "Where numbers become sentences merchants can act on.",
      points: [
        "LLM layer turns each quantified insight into WHAT · WHY · HOW MUCH · WHAT NEXT.",
        "Guardrails: every number cited must come from the analytics layer, never invented.",
      ],
    },
  },
  {
    key: "protectgrow",
    label: "PROTECT / GROW",
    sub: "The two product loops",
    detail: {
      what: "Every insight lands in exactly one of two loops.",
      points: [
        "PROTECT: detect leakage → diagnose why → quantify ₹ → recommend → recover.",
        "GROW: income − commitments → surplus → opportunities → execute → measure.",
      ],
    },
  },
  {
    key: "jev",
    label: "JEV",
    sub: "Decision engine — what's worth acting on?",
    detail: {
      what: "Scores every opportunity so the merchant sees only what matters.",
      points: [
        "Each opportunity is scored, ranked and gated before it reaches the merchant.",
        "High scores below the auto-run threshold become approval requests.",
        "Very high scores inside merchant rules execute automatically (Autopilot).",
      ],
      formula: [
        "impact      = 0.82",
        "confidence  = 0.87",
        "risk        = 0.18",
        "",
        "decision_score = impact × confidence − risk_penalty",
        "               = 0.82 × 0.87 × (1 − 0.18)",
        "               = 0.5334",
        "",
        "decision: APPROVE  (≥ 0.45 approval gate, < 0.75 auto-run)",
      ],
    },
  },
  {
    key: "n8n",
    label: "N8N",
    sub: "Action workflows",
    detail: {
      what: "Executes approved decisions in the real world.",
      points: [
        "Each action type is a workflow: win-back SMS, UPI retry, supplier order, experiment setup.",
        "Workflows pause for approval when the merchant's mode requires it.",
        "Every execution emits an outcome event back into the pipeline.",
      ],
      formula: [
        "Decision → Workflow → WhatsApp message → Customer response → Transaction → Outcome",
        "",
        "win_back: pick customers → template → WhatsApp/SMS gateway → delivery + visit tracking",
        "upi_retry: filter failed collects → re-trigger collect → confirm settlement",
      ],
    },
  },
  {
    key: "outcome",
    label: "OUTCOME",
    sub: "Did it actually work?",
    detail: {
      what: "Closes the loop: measures results against expectations.",
      points: [
        "Matches returned customers / recovered payments to the action that caused them.",
        "Attributes revenue within a confidence window (e.g., 10-day visit window).",
        "Publishes honest results — including actions that didn't work.",
      ],
    },
  },
  {
    key: "cognee2",
    label: "COGNEE",
    sub: "Merchant memory (learning path)",
    detail: {
      what: "The system gets smarter after every action.",
      points: [
        "Outcome data updates the merchant graph: what worked, for whom, when.",
        "Failed experiments become constraints ('don't suggest >10% flat discounts').",
        "Next recommendations start from a smarter baseline. EVENT → … → OUTCOME → LEARNING.",
      ],
    },
  },
];

export default function SystemPage() {
  const [active, setActive] = React.useState<NodeKey | null>(null);
  const node = NODES.find((n) => n.key === active) ?? null;

  return (
    <div className="min-h-screen bg-surface pb-20">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-paytm-secondary">
          HISAAB — System view
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink lg:text-4xl">
          What merchants never have to see.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-inksoft">
          Merchants experience five words: Detect → Explain → Decide → Act → Prove.
          Underneath, this pipeline runs continuously. Click any node to inspect it.
        </p>

        {/* Merchant loop */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-2xs font-bold uppercase tracking-widest text-inksoft">
          <span className="rounded-full border border-line bg-white px-3 py-1">Detect</span>
          <ArrowDown className="size-3 -rotate-90 text-muted" aria-hidden />
          <span className="rounded-full border border-line bg-white px-3 py-1">Explain</span>
          <ArrowDown className="size-3 -rotate-90 text-muted" aria-hidden />
          <span className="rounded-full border border-line bg-white px-3 py-1">Decide</span>
          <ArrowDown className="size-3 -rotate-90 text-muted" aria-hidden />
          <span className="rounded-full border border-line bg-white px-3 py-1">Act</span>
          <ArrowDown className="size-3 -rotate-90 text-muted" aria-hidden />
          <span className="rounded-full border border-line bg-white px-3 py-1">Prove</span>
        </div>

        {/* Pipeline */}
        <div className="mt-10 flex flex-col items-center gap-1.5">
          {NODES.map((n, i) => (
            <React.Fragment key={n.key}>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setActive(n.key)}
                className={cn(
                  "group w-full max-w-xl rounded-2xl border px-5 py-4 text-left transition-all",
                  active === n.key
                    ? "border-paytm bg-lightblue shadow-pop"
                    : "border-line bg-white shadow-card hover:border-paytm/40 hover:shadow-pop"
                )}
                aria-haspopup="dialog"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold tracking-[0.14em] text-ink">
                      {n.label}
                    </p>
                    <p className="mt-0.5 text-xs text-inksoft">{n.sub}</p>
                  </div>
                  <span className="text-2xs font-bold text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.button>
              {i < NODES.length - 1 && (
                <ArrowDown className="size-4 text-paytm/60" aria-hidden />
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted">
          EVENT → CONTEXT → OPPORTUNITY → DECISION → ACTION → OUTCOME →{" "}
          <span className="font-bold text-paytm-secondary">LEARNING</span> · loop closes in
          Cognee
        </p>
      </div>

      {/* Node detail panel */}
      {node && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={node.label}>
          <div
            className="absolute inset-0 bg-paytm-deep/50 backdrop-blur-sm"
            onClick={() => setActive(null)}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-line bg-white p-6 shadow-pop sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-6 sm:w-[460px] sm:rounded-3xl"
          >
            <button
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-inksoft hover:bg-lightblue"
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </button>

            <p className="pr-10 text-lg font-extrabold tracking-[0.12em] text-ink">
              {node.label}
            </p>
            <p className="mt-1 text-sm text-inksoft">{node.sub}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink">{node.detail.what}</p>

            <ul className="mt-4 space-y-2.5">
              {node.detail.points.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-inksoft">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-paytm" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>

            {node.detail.formula && (
              <div className="mt-5 rounded-2xl border border-line bg-lighterblue p-4">
                <p className="mb-3 flex items-center gap-2 text-2xs font-bold uppercase tracking-widest text-paytm-secondary">
                  {node.key === "jev" ? (
                    <>
                      <Calculator className="size-3.5" aria-hidden /> Score gate
                    </>
                  ) : (
                    <>
                      <Workflow className="size-3.5" aria-hidden /> Flow
                    </>
                  )}
                </p>
                {node.detail.formula.map((f, i) =>
                  f === "" ? (
                    <div key={i} className="h-2" />
                  ) : (
                    <p key={i} className="mt-1 font-mono text-xs leading-relaxed text-ink">
                      {f}
                    </p>
                  )
                )}
                {node.key === "jev" && (
                  <div className="mt-4 space-y-2 text-xs font-semibold">
                    <p className="flex items-center gap-2 rounded-lg bg-successsoft px-3 py-2 text-success">
                      <ShieldCheck className="size-3.5" aria-hidden /> score ≥ auto-run
                      threshold &amp; within rules → AUTO-RUN
                    </p>
                    <p className="flex items-center gap-2 rounded-lg bg-lightblue px-3 py-2 text-paytm-deep">
                      <Workflow className="size-3.5" aria-hidden /> else → MERCHANT APPROVAL
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
