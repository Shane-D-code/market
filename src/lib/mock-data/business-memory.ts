import type { AutomationSettings, BusinessMemory } from "@/types";

export const businessMemory: BusinessMemory = {
  businessType: "Textiles / Retail — fabrics & household cloth",
  operatingHours: "9:00 AM – 9:30 PM · Open all days",
  products: [
    { name: "Sarees & dress material", price: "₹450–₹2,800", note: "Highest value category" },
    { name: "Suiting & shirting", price: "₹180–₹1,200", note: "Steady weekday seller" },
    { name: "Household cloth & furnishings", price: "₹90–₹1,600", note: "Bundle candidate" },
    { name: "Alterations & stitching", price: "₹50–₹300", note: "Footfall driver" },
  ],
  busyPeriods: [
    "Friday & Saturday (highest revenue)",
    "Weekday 5–7 PM",
    "Festival weeks (pre-event spikes)",
  ],
  capacity: "2 counters · Rajesh + 1 helper · ~85 bills/day",
  discountPreference: "Max discount 10% · Bundles preferred over flat discounts",
  goals: [
    "Reach ₹5.5L monthly revenue by December",
    "Cut revenue leakage below ₹500/month",
    "Stock up before every local festival week",
  ],
  facts: [
    {
      id: "fact_1",
      fact: "Customers usually return every 12–14 days.",
      category: "Customers",
      learnedOn: "2026-09-18",
      confidence: 91,
      source: "428-customer visit history",
      whyItMatters:
        "Return timing is the earliest signal of churn — a regular who misses one cycle is the cheapest revenue to recover.",
      changesRecommendations:
        "Win-backs now trigger at 1.5× the normal interval, instead of waiting for a full month of silence.",
    },
    {
      id: "fact_2",
      fact: "Your highest revenue days are Friday and Saturday.",
      category: "Demand",
      learnedOn: "2026-09-20",
      confidence: 94,
      source: "90 days of transaction timing",
      whyItMatters:
        "Friday revenue runs ≈24% above average — stock-outs on those two days cost the most.",
      changesRecommendations:
        "Stock top-ups are scheduled Thursday evening, and weekend demand alerts arrive a day early.",
    },
    {
      id: "fact_3",
      fact: "10% discounts increase sales slightly but reduce margin.",
      category: "Pricing",
      learnedOn: "2026-09-03",
      confidence: 87,
      source: "10% discount experiment (completed)",
      whyItMatters:
        "The volume lift (+3.8%) never covered the margin given away (−₹1,200).",
      changesRecommendations:
        "HISAAB now proposes targeted bundles instead of flat discounts, and requires approval for any discount change.",
    },
    {
      id: "fact_4",
      fact: "Demand increases before local events.",
      category: "Demand",
      learnedOn: "2026-09-16",
      confidence: 89,
      source: "Festival-week comparison, last 2 years",
      whyItMatters:
        "Pre-event weeks run 30–40% above baseline — the cheapest growth lever you have.",
      changesRecommendations:
        "HISAAB watches the local events calendar and front-loads supplier orders a week early.",
    },
    {
      id: "fact_5",
      fact: "Stock-outs occurred 3 times last month.",
      category: "Operations",
      learnedOn: "2026-09-22",
      confidence: 92,
      source: "Inventory + sales cross-check",
      whyItMatters:
        "Each stock-out turned away ≈22 ready-to-buy baskets during peak hours.",
      changesRecommendations:
        "Low-stock alerts now fire 48 hours before the pattern predicts a sell-out, not after it happens.",
    },
  ],
};

export const defaultAutomation: AutomationSettings = {
  mode: "APPROVE",
  maxDiscount: 10,
  maxAutoActionValue: 5000,
  allowedActions: [
    "Customer messaging",
    "Win-back campaigns",
    "Demand alerts",
    "UPI retries",
  ],
};
