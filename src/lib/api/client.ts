/**
 * HISAAB data access layer.
 *
 * Today every call resolves from the mock dataset with a small latency so
 * loading/empty states are real. When the FastAPI backend is ready, replace
 * the bodies with fetch() calls to `/api/v1/...` — the signatures (and the
 * UI) stay identical.
 */

import type {
  Action,
  AutomationSettings,
  BusinessMemory,
  CashFlowEvent,
  CashFlowPoint,
  CashFlowSummary,
  Commitment,
  Customer,
  Experiment,
  ImpactSummary,
  Merchant,
  Notification,
  Opportunity,
  Outcome,
  PaytmConnection,
  Transaction,
  TransactionCategory,
  TransactionStatusFilter,
} from "@/types";
import { merchant as merchantData, paytmConnection } from "@/lib/mock-data/merchant";
import {
  activeCustomers,
  atRiskCustomers,
  recentlyLostCustomers,
  highValueCustomers,
  newThisMonth,
  returnIntervalDistribution,
  returningCount,
  activeCount,
  filterCustomers,
  type CustomerFilter,
} from "@/lib/mock-data/customers";
import { opportunities, opportunitySlug } from "@/lib/mock-data/opportunities";
import { findExperimentBySlug } from "@/lib/mock-data/experiments";
import {
  actions,
  cashFlowSeries,
  cashFlowEvents,
  cashFlowSummary,
  commitments,
  experiments,
  impactSummary,
  notifications as notificationsData,
  outcomes,
} from "@/lib/mock-data/operations";
import { transactions as transactionsData } from "@/lib/mock-data/transactions";
import {
  businessMemory as businessMemoryData,
  defaultAutomation,
} from "@/lib/mock-data/business-memory";

const delay = (ms?: number) => new Promise((r) => setTimeout(r, ms ?? 260));

/* ---------------- Merchant ---------------- */

export async function getMerchant(): Promise<Merchant> {
  await delay(120);
  return merchantData;
}

export async function getPaytmConnection(): Promise<PaytmConnection> {
  await delay(100);
  return paytmConnection;
}

/* ---------------- Opportunities ---------------- */

export async function getOpportunities(): Promise<Opportunity[]> {
  await delay();
  return opportunities;
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  await delay(160);
  return opportunities.find((o) => o.id === id) ?? null;
}

export async function getOpportunityBySlug(slug: string): Promise<Opportunity | null> {
  await delay(160);
  return opportunities.find((o) => opportunitySlug(o.id) === slug) ?? null;
}

/* ---------------- Customers ---------------- */

export interface CustomersPayload {
  active: number;
  returning: number;
  atRisk: number;
  newThisMonth: number;
  recentlyLost: number;
  highValueCount: number;
  atRiskCustomers: Customer[];
  activeCustomers: Customer[];
  recentlyLostCustomers: Customer[];
  highValueCustomers: Customer[];
  distribution: { days: number; customers: number }[];
  visibleCustomers: Customer[];
  filter: CustomerFilter;
}

export async function getCustomers(filter: CustomerFilter = "all"): Promise<CustomersPayload> {
  await delay();
  return {
    active: activeCount,
    returning: returningCount,
    atRisk: atRiskCustomers.length,
    newThisMonth,
    recentlyLost: recentlyLostCustomers.length,
    highValueCount: highValueCustomers.length,
    atRiskCustomers,
    activeCustomers,
    recentlyLostCustomers,
    highValueCustomers,
    distribution: returnIntervalDistribution,
    visibleCustomers: filterCustomers(filter),
    filter,
  };
}

/* ---------------- Actions ---------------- */

export async function getActions(): Promise<Action[]> {
  await delay();
  return actions;
}

/* ---------------- Experiments ---------------- */

export async function getExperiments(): Promise<Experiment[]> {
  await delay();
  return experiments;
}

export async function getExperimentBySlug(slug: string): Promise<Experiment | null> {
  await delay(160);
  return findExperimentBySlug(slug);
}

/* ---------------- Cash flow ---------------- */

export async function getCashFlow(): Promise<{
  series: CashFlowPoint[];
  events: CashFlowEvent[];
  summary: CashFlowSummary;
  commitments: Commitment[];
}> {
  await delay();
  return {
    series: cashFlowSeries,
    events: cashFlowEvents,
    summary: cashFlowSummary,
    commitments,
  };
}

/* ---------------- Impact ---------------- */

export async function getImpact(): Promise<{
  summary: ImpactSummary;
  outcomes: Outcome[];
}> {
  await delay();
  return { summary: impactSummary, outcomes };
}

/* ---------------- Transactions ---------------- */

export interface TransactionQuery {
  range: "TODAY" | "7D" | "30D" | "CUSTOM";
  from?: string;
  to?: string;
  status?: TransactionStatusFilter;
  search?: string;
}

export async function getTransactions(q: TransactionQuery): Promise<Transaction[]> {
  await delay();
  let list = [...transactionsData];

  if (q.range === "TODAY") list = list.filter((t) => t.date.startsWith(dayKey(0)));
  if (q.range === "7D") list = list.filter((t) => daysAgoOf(t.date) <= 7);
  if (q.range === "30D") list = list.filter((t) => daysAgoOf(t.date) <= 30);
  if (q.range === "CUSTOM") {
    if (q.from && q.to) {
      const from = new Date(`${q.from}T00:00:00`).getTime();
      const to = new Date(`${q.to}T23:59:59.999`).getTime();
      list = list.filter((t) => {
        const ts = new Date(t.date).getTime();
        return ts >= from && ts <= to;
      });
    } else {
      list = list.filter((t) => daysAgoOf(t.date) <= 7);
    }
  }

  if (q.status && q.status !== "ALL") {
    if (q.status === "INCOME") {
      list = list.filter((t) => t.type === "SALE" && t.status === "COMPLETED");
    } else if (q.status === "REFUND_TYPE") {
      list = list.filter((t) => t.type === "REFUND" || t.status === "REFUNDED");
    } else {
      list = list.filter((t) => t.status === q.status || t.type === q.status);
    }
  }

  if (q.search?.trim()) {
    const s = q.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.customerName?.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s) ||
        t.type.toLowerCase().includes(s) ||
        t.paymentType.toLowerCase().includes(s) ||
        String(t.amount).includes(s) ||
        t.id.includes(s)
    );
  }

  return list.sort((a, b) => {
    const d = new Date(b.date).getTime() - new Date(a.date).getTime();
    return d !== 0 ? d : b.time.localeCompare(a.time);
  });
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  await delay(140);
  return transactionsData.find((t) => t.id === id) ?? null;
}

/* ---------------- Business memory & settings ---------------- */

export async function getBusinessMemory(): Promise<BusinessMemory> {
  await delay();
  return businessMemoryData;
}

export async function getAutomationSettings(): Promise<AutomationSettings> {
  await delay(120);
  return defaultAutomation;
}

/* ---------------- Notifications ---------------- */

export async function getNotifications(): Promise<Notification[]> {
  await delay(100);
  return notificationsData;
}

/* ---------------- Copilot ---------------- */

export interface CopilotAnswer {
  text: string;
  bullets?: string[];
  cta?: { label: string; href: string };
  followUps?: string[];
}

export async function askCopilot(question: string): Promise<CopilotAnswer> {
  await delay(700);
  const q = question.toLowerCase();

  if (q.includes("revenue") && (q.includes("fall") || q.includes("down"))) {
    return {
      text: "You lost ₹18,400 in potential revenue this month. The biggest contributor was:",
      bullets: [
        "6 returning customers who haven't purchased within their normal return window.",
        "₹2,100 from failed UPI payments, mostly 7–9 PM.",
        "₹3,200 margin given away by the 10% discount.",
      ],
      cta: { label: "Review Action", href: "/protect" },
      followUps: ["Which customers should I win back?", "How much money can I safely spend?"],
    };
  }
  if (q.includes("losing money") || q.includes("leak")) {
    return {
      text: "You're leaking ₹18,400 this month. The biggest leaks:",
      bullets: [
        "₹11,500 — 6 regulars overdue on their 12-day return cycle",
        "₹3,200 — 10% discount that isn't driving repeats",
        "₹2,100 — failed UPI payments, mostly 7–9 PM",
      ],
      cta: { label: "Stop the leaks", href: "/protect" },
      followUps: ["Why are customers not returning?", "Show me my leftover."],
    };
  }
  if (q.includes("spend") || q.includes("leftover") || q.includes("afford")) {
    return {
      text: "After upcoming commitments, ₹25,000 is safely available.",
      bullets: [
        "Revenue ₹5,00,000 − expenses ₹3,55,000 − commitments ₹1,20,000.",
        "₹6,000–₹9,000 of it could go to extra weekend stock.",
        "Commitments are already dated — rent, supplier, salary.",
      ],
      cta: { label: "See growth options", href: "/grow" },
      followUps: ["What worked this month?", "Where am I losing money?"],
    };
  }
  if (q.includes("win back") || q.includes("customers")) {
    return {
      text: "6 regulars are overdue. Start with these 3 — worth ₹4,200:",
      bullets: [
        "Anil Deshmukh — ₹1,900 · 21 days since last visit (usual: 12)",
        "Meena Iyer — ₹1,600 · 22 days (usual: 12)",
        "Rahul Verma — ₹1,100 · 19 days (usual: 12)",
      ],
      cta: { label: "Send win-back", href: "/actions" },
      followUps: ["Why did revenue fall this week?", "What worked this month?"],
    };
  }
  if (q.includes("worked") || q.includes("impact") || q.includes("recovered")) {
    return {
      text: "₹42,600 recovered this month. What worked:",
      bullets: [
        "8 AM counter — ₹9,600 measured from 61 extra bills",
        "Win-backs — 18 customers returned, ₹42,600 total recovered",
        "Bundle experiment — +11.4% order value so far",
      ],
      cta: { label: "See the proof", href: "/impact" },
      followUps: ["What should I do today?", "Show me my leftover."],
    };
  }
  if (q.includes("today") || q.includes("do")) {
    return {
      text: "Three things worth your time today:",
      bullets: [
        "Approve the win-back — ₹4,200 recoverable",
        "Retry the 7 failed UPI collects — ₹2,100",
        "Confirm extra weekend stock before Thursday 5 PM",
      ],
      cta: { label: "Open Today's Hisaab", href: "/" },
      followUps: ["Where am I losing money?", "How much can I safely spend?"],
    };
  }

  return {
    text: "Here's your business in one line: revenue ₹5,00,000 this month, ₹18,400 leaking, ₹25,000 free to grow.",
    bullets: [
      "1 decision needs you — the ₹4,200 win-back",
      "1 experiment is running at +11.4%",
    ],
    cta: { label: "See what to act on", href: "/" },
    followUps: ["What should I do today?", "Where am I losing money?"],
  };
}

/* ---------------- helpers ---------------- */

function dayKey(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

function daysAgoOf(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

// Re-export category list for filter UIs
export const transactionCategories: TransactionCategory[] = [
  "Sarees",
  "Suiting",
  "Household",
  "Stitching",
  "Accessories",
  "Yarn",
];
