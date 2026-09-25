import type { Transaction, TransactionCategory, PaymentType } from "@/types";

type Row = [
  daysAgo: number,
  time: string,
  amount: number,
  type: Transaction["type"],
  status: Transaction["status"],
  customer: string | null,
  customerType: Transaction["customerType"],
  category: TransactionCategory,
  payment: PaymentType,
  insight?: string
];

// amount Σ (completed sales) across the 30-day window ≈ ₹5,00,000 monthly
// run-rate; failed/refunded rows reconcile with Protect (₹2,100 failed ·
// ₹950 refunds).
const rows: Row[] = [
  [0, "08:12", 1240, "SALE", "COMPLETED", "Rahul Verma", "REGULAR", "Suiting", "Paytm UPI", "Returning customer"],
  [0, "08:35", 450, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Cash"],
  [0, "09:05", 860, "SALE", "COMPLETED", "Priya Joshi", "REGULAR", "Sarees", "Paytm UPI", "Usual 12-day cycle"],
  [0, "10:22", 2450, "SALE", "COMPLETED", "Anil Deshmukh", "REGULAR", "Suiting", "Paytm UPI"],
  [0, "11:48", 680, "SALE", "COMPLETED", null, "NEW", "Sarees", "Paytm UPI", "First visit — festival buyer"],
  [0, "12:30", 320, "SALE", "COMPLETED", null, "WALK-IN", "Accessories", "Cash"],
  [0, "16:44", 310, "SALE", "FAILED", "Farhan Shaikh", "REGULAR", "Sarees", "Paytm UPI", "UPI decline · 7–9 PM cluster"],
  [0, "17:15", 1540, "SALE", "COMPLETED", "Sunita Patil", "REGULAR", "Household", "Paytm UPI"],
  [0, "19:02", 980, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Card"],
  [0, "20:14", 640, "SALE", "PENDING", null, "NEW", "Household", "Paytm Later"],
  [1, "08:26", 1120, "SALE", "COMPLETED", "Meena Iyer", "REGULAR", "Sarees", "Paytm UPI", "Usual 12-day cycle"],
  [1, "09:40", 280, "SALE", "COMPLETED", null, "WALK-IN", "Accessories", "Cash"],
  [1, "11:05", 1890, "SALE", "COMPLETED", "Jagdish Yadav", "REGULAR", "Yarn", "Paytm UPI"],
  [1, "13:18", 540, "SALE", "COMPLETED", null, "NEW", "Sarees", "Paytm Wallet"],
  [1, "15:52", 2280, "SALE", "COMPLETED", null, "WALK-IN", "Suiting", "Card"],
  [1, "18:36", 165, "SALE", "FAILED", null, "WALK-IN", "Accessories", "Paytm UPI"],
  [1, "19:44", 1720, "SALE", "COMPLETED", "Priya Joshi", "REGULAR", "Sarees", "Paytm UPI"],
  [1, "20:31", 740, "SALE", "COMPLETED", null, "WALK-IN", "Household", "Cash"],
  [2, "08:20", 950, "SALE", "COMPLETED", "Lata Bhide", "REGULAR", "Household", "Paytm UPI"],
  [2, "10:10", 3050, "SALE", "COMPLETED", "Anil Deshmukh", "REGULAR", "Suiting", "Paytm UPI", "Bulk order"],
  [2, "12:42", 410, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Cash"],
  [2, "14:25", 830, "SALE", "COMPLETED", null, "NEW", "Sarees", "Paytm Wallet"],
  [2, "16:58", 760, "SALE", "COMPLETED", "Vikram Rane", "REGULAR", "Yarn", "Paytm UPI"],
  [2, "18:47", 4200, "SALE", "COMPLETED", "Farhan Shaikh", "REGULAR", "Sarees", "Paytm UPI", "Bulk order"],
  [2, "20:05", 1290, "SALE", "COMPLETED", null, "NEW", "Household", "Card"],
  [3, "08:33", 350, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Cash"],
  [3, "09:52", 1620, "SALE", "COMPLETED", "Sunita Patil", "REGULAR", "Household", "Paytm UPI"],
  [3, "11:26", 450, "REFUND", "REFUNDED", null, "WALK-IN", "Sarees", "Paytm UPI", "Color mismatch"],
  [3, "15:14", 1180, "SALE", "COMPLETED", null, "NEW", "Suiting", "Paytm UPI"],
  [3, "17:40", 2900, "SALE", "COMPLETED", "Meena Iyer", "REGULAR", "Sarees", "Paytm UPI"],
  [3, "19:55", 660, "SALE", "COMPLETED", null, "WALK-IN", "Accessories", "Card"],
  [4, "08:18", 1340, "SALE", "COMPLETED", "Rahul Verma", "REGULAR", "Suiting", "Paytm UPI"],
  [4, "10:36", 545, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Cash"],
  [4, "12:55", 1980, "SALE", "COMPLETED", "Jagdish Yadav", "REGULAR", "Yarn", "Paytm UPI"],
  [4, "16:20", 300, "SALE", "COMPLETED", null, "WALK-IN", "Accessories", "Cash"],
  [4, "18:22", 1450, "SALE", "COMPLETED", null, "NEW", "Household", "Paytm Wallet"],
  [4, "20:48", 2600, "SALE", "COMPLETED", null, "NEW", "Sarees", "Paytm UPI", "Festival saree"],
  [5, "08:44", 495, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Cash"],
  [5, "11:15", 1780, "SALE", "COMPLETED", "Priya Joshi", "REGULAR", "Sarees", "Paytm UPI"],
  [5, "14:03", 352, "SALE", "COMPLETED", null, "WALK-IN", "Accessories", "Card"],
  [5, "17:26", 3500, "SALE", "COMPLETED", "Anil Deshmukh", "REGULAR", "Suiting", "Paytm UPI"],
  [5, "19:38", 830, "SALE", "COMPLETED", null, "WALK-IN", "Yarn", "Paytm UPI"],
  [6, "08:30", 860, "SALE", "COMPLETED", "Sameer Khan", "REGULAR", "Suiting", "Paytm UPI", "Usual 11-day cycle"],
  [6, "10:44", 1420, "SALE", "COMPLETED", null, "NEW", "Sarees", "Paytm UPI"],
  [6, "13:07", 338, "SALE", "COMPLETED", null, "WALK-IN", "Accessories", "Cash"],
  [6, "16:31", 2870, "SALE", "COMPLETED", "Lata Bhide", "REGULAR", "Household", "Paytm Wallet"],
  [6, "19:19", 1660, "SALE", "COMPLETED", null, "WALK-IN", "Suiting", "Card"],
  [7, "09:02", 1500, "SALE", "COMPLETED", null, "WALK-IN", "Sarees", "Paytm UPI"],
  [7, "11:38", 240, "SALE", "FAILED", null, "WALK-IN", "Accessories", "Paytm UPI"],
  [7, "15:45", 1660, "SALE", "COMPLETED", "Vikram Rane", "REGULAR", "Yarn", "Paytm UPI"],
  [7, "20:02", 3150, "SALE", "COMPLETED", "Farhan Shaikh", "REGULAR", "Sarees", "Paytm UPI"],
  [8, "08:52", 625, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Cash"],
  [8, "12:14", 1640, "SALE", "COMPLETED", "Sunita Patil", "REGULAR", "Household", "Paytm UPI"],
  [8, "17:33", 488, "SALE", "COMPLETED", null, "WALK-IN", "Accessories", "Card"],
  [9, "09:24", 2750, "SALE", "COMPLETED", "Meena Iyer", "REGULAR", "Sarees", "Paytm UPI"],
  [9, "16:41", 710, "SALE", "COMPLETED", null, "NEW", "Suiting", "Paytm UPI"],
  [9, "19:57", 495, "SALE", "COMPLETED", null, "WALK-IN", "Accessories", "Paytm Wallet"],
  [10, "10:05", 1480, "SALE", "COMPLETED", "Jagdish Yadav", "REGULAR", "Yarn", "Paytm UPI"],
  [10, "14:52", 650, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Cash"],
  [11, "09:36", 1240, "SALE", "COMPLETED", null, "NEW", "Sarees", "Paytm UPI"],
  [12, "11:21", 6200, "SALE", "COMPLETED", "Farhan Shaikh", "REGULAR", "Sarees", "Paytm UPI", "Bulk order"],
  [12, "17:29", 1820, "SALE", "COMPLETED", null, "WALK-IN", "Household", "Card"],
  [13, "08:47", 440, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Cash"],
  [13, "15:33", 1990, "SALE", "COMPLETED", "Rahul Verma", "REGULAR", "Suiting", "Paytm UPI"],
  [14, "10:12", 4650, "SALE", "COMPLETED", "Anil Deshmukh", "REGULAR", "Suiting", "Paytm UPI"],
  [15, "12:38", 1470, "SALE", "COMPLETED", null, "NEW", "Household", "Paytm UPI"],
  [16, "09:14", 630, "SALE", "COMPLETED", null, "WALK-IN", "Stitching", "Cash"],
  [16, "18:05", 2980, "SALE", "COMPLETED", "Sunita Patil", "REGULAR", "Household", "Paytm UPI"],
  [17, "11:56", 1760, "SALE", "COMPLETED", null, "WALK-IN", "Sarees", "Card"],
  [18, "10:41", 1540, "SALE", "COMPLETED", null, "NEW", "Sarees", "Paytm Wallet"],
  [18, "19:26", 820, "SALE", "COMPLETED", null, "WALK-IN", "Yarn", "Paytm UPI"],
  [19, "09:58", 3210, "SALE", "COMPLETED", "Meena Iyer", "REGULAR", "Sarees", "Paytm UPI"],
  [21, "10:33", 1860, "SALE", "COMPLETED", "Priya Joshi", "REGULAR", "Sarees", "Paytm UPI"],
  [22, "12:47", 1330, "SALE", "COMPLETED", null, "WALK-IN", "Suiting", "Cash"],
  [24, "09:45", 3560, "SALE", "COMPLETED", "Jagdish Yadav", "REGULAR", "Yarn", "Paytm UPI"],
  [25, "14:18", 1640, "SALE", "COMPLETED", null, "NEW", "Sarees", "Paytm UPI"],
  [26, "10:52", 2415, "SALE", "COMPLETED", "Lata Bhide", "REGULAR", "Household", "Paytm Wallet"],
  [28, "13:24", 1890, "SALE", "COMPLETED", null, "WALK-IN", "Sarees", "Card"],
  [29, "11:36", 3720, "SALE", "COMPLETED", "Vikram Rane", "REGULAR", "Yarn", "Paytm UPI"],
];

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

export const transactions: Transaction[] = rows.map((r, i) => ({
  id: `txn_${String(i + 1).padStart(4, "0")}`,
  date: isoDaysAgo(r[0]),
  time: r[1],
  amount: r[2],
  type: r[3],
  status: r[4],
  customerName: r[5],
  customerType: r[6] ?? "WALK-IN",
  category: r[7],
  paymentType: r[8],
  insight: r[9],
}));

/** Month summary strip values (reconcile with merchant profile) */
export const monthTotals = {
  revenue: 500000,
  failedValue: 2100,
  refundedValue: 950,
  pendingValue: 640,
};
