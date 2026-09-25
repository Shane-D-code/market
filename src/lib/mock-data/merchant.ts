import type { Merchant, PaytmConnection } from "@/types";

/**
 * The demo merchant. Every number across the app reconciles to this profile:
 * monthly revenue ₹5,00,000 · expenditure ₹3,55,000 · commitments ₹1,20,000
 * → projected leftover ₹25,000.
 * Leakage ₹18,400 = churn 11,500 + failed payments 2,100 + discounts 3,200
 * + refunds 950 + other 650.
 */
export const merchant: Merchant = {
  id: "mrc_001",
  storeName: "Rajesh Textiles",
  ownerName: "Rajesh Kumar",
  category: "Textiles / Retail",
  city: "Pune",
  phone: "+91 98220 •••21",
  memberSince: "2024-03-01",
  avatarInitials: "RK",
};

export const paytmConnection: PaytmConnection = {
  connected: true,
  lastSyncAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  dataSources: [
    { label: "Transactions", connected: true },
    { label: "Settlements", connected: true },
    { label: "Refunds", connected: true },
    { label: "Payment status", connected: true },
  ],
  optionalIntegrations: [
    { label: "Soundbox", connected: true },
    { label: "POS", connected: false },
    { label: "Inventory", connected: true },
    { label: "Accounting", connected: false },
  ],
};
