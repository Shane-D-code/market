"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Store,
  Clock,
  Package,
  Flame,
  Users2,
  Tag,
  Target,
  Sparkles,
  Check,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";
import {
  getBusinessMemory,
  getAutomationSettings,
  getPaytmConnection,
} from "@/lib/api/client";
import { usePageData } from "@/hooks/use-page-data";
import { cn, relativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MemoryCard } from "@/features/shared/memory-card";
import { StatusBadge } from "@/features/shared/primitives";
import type { AutomationSettings } from "@/types";

const MODES: {
  id: AutomationSettings["mode"];
  title: string;
  tagline: string;
  detail: string;
}[] = [
  {
    id: "ASSIST",
    title: "Assist",
    tagline: "HISAAB recommends actions. You execute them.",
    detail: "You'll see opportunities and prepare actions yourself.",
  },
  {
    id: "APPROVE",
    title: "Approve",
    tagline: "HISAAB prepares actions. You approve before execution.",
    detail: "The balanced default — nothing runs without your tap.",
  },
  {
    id: "AUTOPILOT",
    title: "Autopilot",
    tagline: "HISAAB executes approved low-risk actions automatically.",
    detail: "Only actions under your value cap and allowed list. Everything is logged.",
  },
];

export default function SettingsPage() {
  const { data: memory } = usePageData(getBusinessMemory, []);
  const { data: auto } = usePageData(getAutomationSettings, []);
  const { data: connection } = usePageData(getPaytmConnection, []);
  const [mode, setMode] = React.useState<AutomationSettings["mode"]>("APPROVE");
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (auto) setMode(auto.mode);
  }, [auto]);

  const saveMode = (m: AutomationSettings["mode"]) => {
    setMode(m);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="What HISAAB has learned — and how much it may do for you."
      />

      {/* What HISAAB has learned */}
      <section aria-labelledby="memory-heading">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles className="size-4 text-paytm-secondary" aria-hidden />
          <h2 id="memory-heading" className="text-xl font-extrabold tracking-tight text-ink">
            What HISAAB has learned
          </h2>
        </div>

        {!memory ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {memory.facts.map((f, i) => (
              <MemoryCard
                key={f.id}
                fact={f.fact}
                category={f.category}
                confidence={f.confidence}
                source={f.source}
                whyItMatters={f.whyItMatters}
                changesRecommendations={f.changesRecommendations}
                delay={0.04 * i}
              />
            ))}
          </div>
        )}
      </section>

      {/* Business profile */}
      <section className="mt-12" aria-labelledby="profile-heading">
        <h2 id="profile-heading" className="text-xl font-extrabold tracking-tight text-ink">
          Business profile
        </h2>
        {!memory ? (
          <Skeleton className="mt-4 h-64 rounded-2xl" />
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              {[
                { icon: Store, label: "Business type", value: memory.businessType },
                { icon: Clock, label: "Operating hours", value: memory.operatingHours },
                { icon: Users2, label: "Capacity", value: memory.capacity },
                { icon: Tag, label: "Discount preference", value: memory.discountPreference },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex gap-3.5 border-b border-line py-3.5 first:pt-0 last:border-0 last:pb-0"
                >
                  <r.icon className="mt-0.5 size-4 shrink-0 text-paytm-secondary/80" aria-hidden />
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
                      {r.label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-ink">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <Package className="size-4 text-paytm-secondary/80" aria-hidden />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-inksoft/80">
                    Products & price points
                  </h3>
                </div>
                <div className="mt-3 space-y-2.5">
                  {memory.products.map((p) => (
                    <div key={p.name} className="flex items-baseline justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">{p.name}</p>
                        {p.note && <p className="text-xs text-inksoft">{p.note}</p>}
                      </div>
                      <p className="shrink-0 text-sm font-bold text-paytm-deep">{p.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <Flame className="size-4 text-paytm-secondary/80" aria-hidden />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-inksoft/80">
                    Busy periods
                  </h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {memory.busyPeriods.map((b) => (
                    <Badge key={b} variant="default">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-paytm-secondary/80" aria-hidden />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-inksoft/80">
                    Business goals
                  </h3>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {memory.goals.map((g) => (
                    <li key={g} className="flex gap-2.5 text-sm text-inksoft">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-paytm" aria-hidden />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Automation */}
      <section className="mt-12" aria-labelledby="automation-heading">
        <h2 id="automation-heading" className="text-2xl font-extrabold tracking-tight text-ink">
          Automation mode
        </h2>
        <p className="mt-1 text-sm text-inksoft">
          You're always in control. Change it anytime.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {MODES.map((m, i) => {
            const active = mode === m.id;
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => saveMode(m.id)}
                className={cn(
                  "relative rounded-2xl border p-5 text-left transition-all",
                  active
                    ? "border-paytm-deep bg-paytm-deep text-white shadow-pop"
                    : "border-line bg-white shadow-card hover:-translate-y-0.5 hover:shadow-pop"
                )}
                aria-pressed={active}
              >
                {active && (
                  <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-white">
                    <Check className="size-3.5 text-paytm-deep" aria-hidden />
                  </span>
                )}
                <p
                  className={cn(
                    "text-2xs font-bold uppercase tracking-widest",
                    active ? "text-lightblue" : "text-paytm-secondary"
                  )}
                >
                  {m.id}
                </p>
                <p className="mt-1.5 text-xl font-extrabold">{m.title}</p>
                <p
                  className={cn(
                    "mt-1.5 text-sm font-semibold leading-snug",
                    active ? "text-lightblue" : "text-ink"
                  )}
                >
                  {m.tagline}
                </p>
                <p
                  className={cn(
                    "mt-2 text-xs leading-relaxed",
                    active ? "text-lightblue/85" : "text-inksoft"
                  )}
                >
                  {m.detail}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Limits */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
              Maximum action
            </p>
            <p className="mt-1 text-3xl font-extrabold text-ink">
              ₹{(auto?.maxAutoActionValue ?? 5000).toLocaleString("en-IN")}
            </p>
            <p className="mt-2 text-xs text-inksoft">
              Actions above this always need your approval — even on Autopilot.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
              Customer messaging
            </p>
            <div className="mt-3">
              <StatusBadge label="Enabled" tone="positive" />
            </div>
            <p className="mt-3 text-xs text-inksoft">
              Win-back and campaign messages are always personalized and logged.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <p className="text-2xs font-semibold uppercase tracking-widest text-inksoft/70">
              Discount changes
            </p>
            <div className="mt-3">
              <StatusBadge label="Require approval" tone="warning" />
            </div>
            <p className="mt-3 text-xs text-inksoft">
              HISAAB never changes a price or offer without your explicit approval.
            </p>
          </div>
        </div>

        {saved && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-2 text-sm font-bold text-success"
          >
            <Check className="size-4" aria-hidden /> Preference saved.
          </motion.p>
        )}
      </section>

      {/* Paytm connection */}
      <section className="mt-12" aria-labelledby="connection-heading">
        <h2 id="connection-heading" className="text-xl font-extrabold tracking-tight text-ink">
          Connections
        </h2>
        {!connection ? (
          <Skeleton className="mt-4 h-48 rounded-2xl" />
        ) : (
          <div className="mt-4 rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-5 text-success" aria-hidden />
                <div>
                  <p className="text-sm font-bold text-ink">● Paytm Connected</p>
                  <p className="text-xs text-inksoft">
                    Last synced: {relativeTime(connection.lastSyncAt)}
                  </p>
                </div>
              </div>
              <StatusBadge label="Live" tone="positive" />
            </div>

            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-2xs font-bold uppercase tracking-widest text-inksoft/70">
                  Data sources
                </p>
                <ul className="mt-2 space-y-1.5">
                  {connection.dataSources.map((s) => (
                    <li key={s.label} className="flex items-center gap-2 text-sm text-inksoft">
                      <Check className="size-3.5 text-success" aria-hidden /> {s.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-2xs font-bold uppercase tracking-widest text-inksoft/70">
                  Optional integrations
                </p>
                <ul className="mt-2 space-y-1.5">
                  {connection.optionalIntegrations.map((s) => (
                    <li key={s.label} className="flex items-center gap-2 text-sm">
                      {s.connected ? (
                        <>
                          <Check className="size-3.5 text-success" aria-hidden />
                          <span className="text-inksoft">{s.label}</span>
                        </>
                      ) : (
                        <>
                          <span className="flex size-3.5 items-center justify-center" aria-hidden>
                            <span className="size-1.5 rounded-full bg-line" />
                          </span>
                          <span className="text-muted">{s.label} — not connected</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
