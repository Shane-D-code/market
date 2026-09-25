"use client";

import { motion } from "framer-motion";
import { Lightbulb, HelpCircle, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function MemoryCard({
  fact,
  category,
  confidence,
  source,
  whyItMatters,
  changesRecommendations,
  delay = 0,
  className,
}: {
  fact: string;
  category: string;
  confidence: number;
  source: string;
  whyItMatters: string;
  changesRecommendations: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={cn(
        "flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant="default">{category}</Badge>
        <span className="text-2xs font-semibold text-muted">
          {confidence}% confidence
        </span>
      </div>

      <p className="mt-3 flex gap-2 text-sm font-bold leading-relaxed text-ink">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-paytm-secondary" aria-hidden />
        {fact}
      </p>

      <div className="mt-4 space-y-3 border-t border-line pt-4">
        <div>
          <p className="text-2xs font-bold uppercase tracking-widest text-muted">
            Why it matters
          </p>
          <p className="mt-1 flex gap-2 text-sm leading-relaxed text-inksoft">
            <HelpCircle className="mt-0.5 size-3.5 shrink-0 text-inksoft/60" aria-hidden />
            {whyItMatters}
          </p>
        </div>
        <div>
          <p className="text-2xs font-bold uppercase tracking-widest text-muted">
            How it changes our recommendations
          </p>
          <p className="mt-1 flex gap-2 text-sm leading-relaxed text-inksoft">
            <Repeat className="mt-0.5 size-3.5 shrink-0 text-inksoft/60" aria-hidden />
            {changesRecommendations}
          </p>
        </div>
      </div>

      <p className="mt-auto pt-4 text-2xs text-muted">{source}</p>
    </motion.article>
  );
}
