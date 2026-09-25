"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function InsightCard({
  index,
  value,
  label,
  meaning,
  trend,
  tone = "neutral",
  href,
  delay = 0,
}: {
  index?: string;
  value: string;
  label: string;
  meaning: string;
  trend?: { value: string; up: boolean };
  tone?: "neutral" | "danger" | "grow" | "maroon";
  href?: string;
  delay?: number;
}) {
  const toneMap = {
    neutral: "bg-white",
    maroon: "bg-maroon-700 text-warmwhite",
    danger: "bg-white",
    grow: "bg-white",
  } as const;

  const valueColor = {
    neutral: "text-ink",
    danger: "text-maroon-600",
    grow: "text-grow",
    maroon: "text-warmwhite",
  } as const;

  const body = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border p-5 transition-all",
        tone === "maroon"
          ? "border-maroon-800 shadow-pop hover:shadow-lg"
          : "border-maroon-700/10 bg-white shadow-card hover:-translate-y-0.5 hover:shadow-pop",
        toneMap[tone]
      )}
    >
      {index && (
        <span
          className={cn(
            "section-num absolute -right-1 -top-3 text-5xl",
            tone === "maroon" && "section-num-light"
          )}
        >
          {index}
        </span>
      )}
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-widest",
          tone === "maroon" ? "text-blush/80" : "text-inksoft/80"
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-3 font-display text-4xl font-extrabold tracking-tight",
          valueColor[tone]
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-2 max-w-[26ch] text-sm leading-snug",
          tone === "maroon" ? "text-blush" : "text-inksoft"
        )}
      >
        {meaning}
      </p>
      {trend && (
        <p
          className={cn(
            "mt-3 flex items-center gap-1 text-xs font-semibold",
            tone === "maroon"
              ? "text-blush"
              : trend.up
                ? "text-grow"
                : "text-maroon-600"
          )}
        >
          {trend.up ? (
            <ArrowUpRight className="size-3.5" />
          ) : (
            <ArrowDownRight className="size-3.5" />
          )}
          {trend.value}
        </p>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {body}
      </Link>
    );
  }
  return body;
}
