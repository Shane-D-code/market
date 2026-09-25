import type { Customer } from "@/types";

/**
 * At-risk values reconcile with the Protect page: the 6 overdue regulars are
 * worth ₹11,500/month combined. The recommended win-back targets the top
 * recoverable cluster = ₹4,200 (Rahul 1,100 + Anil 1,900 + Farhan 1,200).
 * Return interval per spec: usual 12 days · current gap 19 days.
 */
export const atRiskCustomers: Customer[] = [
  {
    id: "cus_101",
    name: "Rahul Verma",
    phoneMasked: "+91 90••• ••217",
    visits: 64,
    lastVisitDaysAgo: 19,
    typicalIntervalDays: 12,
    estimatedValue: 1100,
    status: "AT_RISK",
    segment: "Monthly suiting buyer",
    favoriteItems: ["Suiting", "Shirting", "Accessories"],
  },
  {
    id: "cus_102",
    name: "Anil Deshmukh",
    phoneMasked: "+91 93••• ••441",
    visits: 51,
    lastVisitDaysAgo: 21,
    typicalIntervalDays: 12,
    estimatedValue: 1900,
    status: "AT_RISK",
    segment: "Bulk fabric buyer",
    favoriteItems: ["Suiting", "Yarn", "Household"],
  },
  {
    id: "cus_103",
    name: "Farhan Shaikh",
    phoneMasked: "+91 95••• ••089",
    visits: 43,
    lastVisitDaysAgo: 19,
    typicalIntervalDays: 12,
    estimatedValue: 1200,
    status: "AT_RISK",
    segment: "Festival saree buyer",
    favoriteItems: ["Sarees", "Accessories"],
  },
  {
    id: "cus_104",
    name: "Sunita Patil",
    phoneMasked: "+91 97••• ••654",
    visits: 38,
    lastVisitDaysAgo: 20,
    typicalIntervalDays: 12,
    estimatedValue: 1400,
    status: "AT_RISK",
    segment: "Household cloth regular",
    favoriteItems: ["Household", "Stitching"],
  },
  {
    id: "cus_105",
    name: "Meena Iyer",
    phoneMasked: "+91 91••• ••375",
    visits: 33,
    lastVisitDaysAgo: 22,
    typicalIntervalDays: 12,
    estimatedValue: 1600,
    status: "AT_RISK",
    segment: "Saree & blouse piece regular",
    favoriteItems: ["Sarees", "Stitching"],
  },
  {
    id: "cus_106",
    name: "Jagdish Yadav",
    phoneMasked: "+91 96••• ••722",
    visits: 27,
    lastVisitDaysAgo: 24,
    typicalIntervalDays: 12,
    estimatedValue: 1300,
    status: "AT_RISK",
    segment: "Tailor-shop supplier",
    favoriteItems: ["Yarn", "Accessories"],
  },
];

/** Healthy regulars shown in the distribution strip */
export const activeCustomers: Customer[] = [
  {
    id: "cus_201",
    name: "Priya Joshi",
    phoneMasked: "+91 92••• ••115",
    visits: 58,
    lastVisitDaysAgo: 2,
    typicalIntervalDays: 12,
    estimatedValue: 2100,
    status: "ACTIVE",
    segment: "Fortnightly saree buyer",
    favoriteItems: ["Sarees", "Accessories"],
  },
  {
    id: "cus_202",
    name: "Sameer Khan",
    phoneMasked: "+91 99••• ••802",
    visits: 47,
    lastVisitDaysAgo: 4,
    typicalIntervalDays: 11,
    estimatedValue: 1700,
    status: "ACTIVE",
    segment: "Weekly suiting buyer",
    favoriteItems: ["Suiting", "Yarn"],
  },
  {
    id: "cus_203",
    name: "Lata Bhide",
    phoneMasked: "+91 98••• ••540",
    visits: 41,
    lastVisitDaysAgo: 3,
    typicalIntervalDays: 12,
    estimatedValue: 1400,
    status: "ACTIVE",
    segment: "Household cloth monthly",
    favoriteItems: ["Household", "Stitching"],
  },
  {
    id: "cus_204",
    name: "Vikram Rane",
    phoneMasked: "+91 90••• ••666",
    visits: 29,
    lastVisitDaysAgo: 1,
    typicalIntervalDays: 10,
    estimatedValue: 1100,
    status: "ACTIVE",
    segment: "Tailoring supplies",
    favoriteItems: ["Yarn", "Accessories"],
  },
];

export const newThisMonth = 38;
export const returningCount = 176;
export const activeCount = 428;

/** Return-interval distribution for the Customers page strip (days → customers) */
export const returnIntervalDistribution: { days: number; customers: number }[] = [
  { days: 4, customers: 22 },
  { days: 8, customers: 51 },
  { days: 10, customers: 68 },
  { days: 12, customers: 89 },
  { days: 14, customers: 64 },
  { days: 16, customers: 38 },
  { days: 18, customers: 17 },
  { days: 20, customers: 6 },
];

/** Recently lost — dormant beyond two cycles, not currently in a win-back */
export const recentlyLostCustomers: Customer[] = [
  {
    id: "cus_301",
    name: "Dinesh Gupta",
    phoneMasked: "+91 94••• ••388",
    visits: 18,
    lastVisitDaysAgo: 67,
    typicalIntervalDays: 14,
    estimatedValue: 2200,
    status: "DORMANT",
    segment: "Wholesale buyer · moved area",
    favoriteItems: ["Suiting", "Yarn"],
  },
  {
    id: "cus_302",
    name: "Kavita Menon",
    phoneMasked: "+91 89••• ••541",
    visits: 12,
    lastVisitDaysAgo: 74,
    typicalIntervalDays: 16,
    estimatedValue: 1800,
    status: "DORMANT",
    segment: "Festival saree buyer",
    favoriteItems: ["Sarees"],
  },
];

/** High value — top lifetime spenders */
export type CustomerFilter =
  | "all"
  | "at-risk"
  | "returning"
  | "recently-lost"
  | "high-value";

export function filterCustomers(filter: CustomerFilter): Customer[] {
  if (filter === "at-risk") return [...atRiskCustomers];
  if (filter === "returning") return [...activeCustomers];
  if (filter === "recently-lost") return [...recentlyLostCustomers];
  if (filter === "high-value") return [...highValueCustomers];

  const all = [...atRiskCustomers, ...activeCustomers, ...recentlyLostCustomers, ...highValueCustomers];
  return Array.from(new Map(all.map((customer) => [customer.id, customer])).values());
}

export const highValueCustomers: Customer[] = [
  {
    id: "cus_401",
    name: "Sharma Saree House",
    phoneMasked: "+91 98••• ••990",
    visits: 96,
    lastVisitDaysAgo: 5,
    typicalIntervalDays: 9,
    estimatedValue: 8400,
    status: "ACTIVE",
    segment: "Wholesale resale partner",
    favoriteItems: ["Sarees", "Yarn"],
  },
  {
    id: "cus_402",
    name: "Gupta Fabrics",
    phoneMasked: "+91 97••• ••123",
    visits: 74,
    lastVisitDaysAgo: 8,
    typicalIntervalDays: 11,
    estimatedValue: 6100,
    status: "ACTIVE",
    segment: "Bulk suiting buyer",
    favoriteItems: ["Suiting", "Household"],
  },
];
