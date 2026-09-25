// HISAAB domain models
// The mock data layer implements these contracts; a FastAPI backend can later
// implement the same shapes without touching the UI.

export interface Merchant {
  id: string;
  storeName: string;
  ownerName: string;
  category: string;
  city: string;
  phone: string;
  memberSince: string;
  avatarInitials: string;
}

/** Paytm connection status shown in sidebar/topbar/settings */
export interface PaytmConnection {
  connected: boolean;
  lastSyncAt: string; // ISO
  dataSources: { label: string; connected: boolean }[];
  optionalIntegrations: { label: string; connected: boolean }[];
}

export type PaymentType =
  | "UPI"
  | "Paytm UPI"
  | "Paytm Wallet"
  | "Cash"
  | "Card"
  | "Paytm Later";

export type PaymentStatus = "COMPLETED" | "FAILED" | "REFUNDED" | "PENDING";

/** Transaction filter: payment status or record type (Income/Refund/Settlement) */
export type TransactionStatusFilter =
  | PaymentStatus
  | "ALL"
  | "INCOME"
  | "REFUND_TYPE"
  | "SETTLEMENT";

export type TransactionCategory =
  | "Sarees"
  | "Suiting"
  | "Household"
  | "Stitching"
  | "Accessories"
  | "Yarn";

export type TransactionType = "SALE" | "REFUND" | "SETTLEMENT" | "PAYOUT";

export interface Transaction {
  id: string;
  date: string; // ISO
  time: string; // HH:mm
  amount: number;
  type: TransactionType;
  paymentType: PaymentType;
  status: PaymentStatus;
  customerName: string | null;
  category: TransactionCategory;
  customerType?: "REGULAR" | "NEW" | "WALK-IN";
  note?: string;
  /** e.g. "Returning customer", "Usual 12-day cycle" */
  insight?: string;
}

export interface Customer {
  id: string;
  name: string;
  phoneMasked: string;
  visits: number;
  lastVisitDaysAgo: number;
  typicalIntervalDays: number;
  estimatedValue: number;
  status: "AT_RISK" | "ACTIVE" | "NEW" | "DORMANT";
  segment: string;
  favoriteItems: string[];
  /** Merchant intelligence framing, e.g. "Win back" */
  recommendation?: string;
}

export type OpportunityType = "PROTECT" | "GROW" | "OPTIMIZE";
export type OpportunityStatus =
  | "NEW"
  | "APPROVAL"
  | "RUNNING"
  | "COMPLETED"
  | "REJECTED";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  description: string;
  impact: number;
  confidence: number;
  risk: RiskLevel;
  recommendedAction: string;
  status: OpportunityStatus;
  evidence: { label: string; value: string }[];
  why: string[];
  actionPreview?: string;
  category: string; // e.g. "Customer churn", "Failed payments"
  detectedAt: string;
}

export interface Action {
  id: string;
  opportunityId: string;
  title: string;
  type: "WIN_BACK" | "STOCK_ALERT" | "EXPERIMENT" | "PAYMENT_RECOVERY" | "BUNDLE";
  status: "WAITING_APPROVAL" | "RUNNING" | "COMPLETED" | "REJECTED";
  expectedImpact: number;
  actualImpact?: number;
  requiresApproval: boolean;
  createdAt: string;
  completedAt?: string;
  resultSummary?: string;
  customersReached?: number;
}

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  status: "RUNNING" | "COMPLETED" | "STOPPED";
  startDate: string;
  endDate: string;
  controlValue: number;
  testValue: number;
  lift?: number;
  confidence?: number;
  revenueImpact?: number;
  marginImpact?: number;
  verdict?: "WIN" | "FAILED" | "INCONCLUSIVE";
  recommendation?: string;
  daysElapsed?: number;
  daysTotal?: number;
}

export interface CashFlowPoint {
  date: string;
  label: string;
  moneyIn: number;
  moneyOut: number;
}

export interface Commitment {
  id: string;
  label: string;
  amount: number;
  dueInDays: number;
  category: string;
}

/** Timeline entry for the cash-flow page: money in/out by day */
export interface CashFlowEvent {
  inDays: number;
  label: string;
  amount: number;
  kind: "IN" | "OUT";
  note?: string;
}

export interface CashFlowSummary {
  moneyIn: number;
  moneyOut: number;
  upcomingCommitments: number;
  projectedLeftover: number;
  naturalSummary: string;
}

export interface Outcome {
  id: string;
  opportunityId: string;
  actionTitle: string;
  expected: number;
  recovered: number;
  customersReturned: number;
  costsAvoided: number;
  completedAt: string;
  timeline: { stage: string; detail: string; at: string; value?: number }[];
}

export interface ImpactSummary {
  recoveredThisMonth: number;
  revenueRecovered: number;
  customersReturned: number;
  costsAvoided: number;
  experimentsRun: number;
  positiveExperiments: number;
}

export interface BusinessMemoryFact {
  id: string;
  fact: string;
  category: string;
  learnedOn: string;
  confidence: number;
  source: string;
  /** WHY IT MATTERS */
  whyItMatters: string;
  /** HOW IT CHANGES OUR RECOMMENDATIONS */
  changesRecommendations: string;
}

export interface BusinessMemory {
  businessType: string;
  operatingHours: string;
  products: { name: string; price: string; note?: string }[];
  busyPeriods: string[];
  capacity: string;
  discountPreference: string;
  goals: string[];
  facts: BusinessMemoryFact[];
}

export interface AutomationSettings {
  mode: "ASSIST" | "APPROVE" | "AUTOPILOT";
  maxDiscount: number;
  maxAutoActionValue: number;
  allowedActions: string[];
}

export type NotificationKind =
  | "OPPORTUNITY"
  | "ACTION"
  | "OUTCOME"
  | "FORECAST"
  | "EXPERIMENT";

export interface Notification {
  id: string;
  kind: NotificationKind;
  message: string;
  detail: string;
  at: string;
  read: boolean;
  href?: string;
}
