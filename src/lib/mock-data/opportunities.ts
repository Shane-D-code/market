import type { Opportunity } from "@/types";

export const opportunitySlugs: Record<string, string> = {
  opp_001: "revenue-recovery",
  opp_002: "failed-payments",
  opp_003: "discount-leakage",
  opp_004: "weekend-stock",
  opp_005: "product-bundle",
  opp_006: "express-counter",
};

export function opportunitySlug(id: string): string {
  return opportunitySlugs[id] ?? id.toLowerCase();
}

export function opportunityHref(id: string): string {
  return `/protect/opportunities/${opportunitySlug(id)}`;
}

export const opportunities: Opportunity[] = [
  {
    id: "opp_001",
    type: "PROTECT",
    title: "₹4,200 recoverable from customer return gap",
    description:
      "6 regular customers haven't returned within their normal purchasing interval.",
    impact: 18400,
    confidence: 87,
    risk: "HIGH",
    recommendedAction: "Send a targeted win-back message",
    status: "APPROVAL",
    category: "Customer churn",
    detectedAt: "2026-09-25T07:40:00+05:30",
    evidence: [
      { label: "Expected return", value: "12 days" },
      { label: "Current gap", value: "19 days" },
      { label: "Customers flagged", value: "6 regulars · 214 prior visits" },
    ],
    why: [
      "Each of the 6 has visited 15+ times and always returned within 12 days.",
      "Their combined monthly spend averages ₹11,500.",
      "None have visited in 19+ days — the longest gap since tracking began.",
    ],
    actionPreview:
      "Hi {name}, we've missed you at Rajesh Textiles. Here's ₹100 off your next visit this week.",
  },
  {
    id: "opp_002",
    type: "PROTECT",
    title: "₹2,100 lost to failed payments",
    description:
      "UPI declines spiking during 7–9 PM. Customers left without paying.",
    impact: 2100,
    confidence: 92,
    risk: "MEDIUM",
    recommendedAction: "Retry failed UPI collects automatically",
    status: "NEW",
    category: "Failed payments",
    detectedAt: "2026-09-25T08:10:00+05:30",
    evidence: [
      { label: "Failures this week", value: "14 of 38 UPI attempts" },
      { label: "Peak window", value: "7–9 PM" },
      { label: "Avg basket lost", value: "₹150" },
    ],
    why: [
      "Failure rate jumped 4× above your usual 6% baseline.",
      "Largest losses on Friday and Saturday evenings — your busiest hours.",
      "9 of 14 customers completed the purchase on their next visit.",
    ],
    actionPreview:
      "Auto-retry the 7 declined UPI collects from last evening. 9 customers already re-attempted in person.",
  },
  {
    id: "opp_003",
    type: "OPTIMIZE",
    title: "Your 10% discount isn't generating enough additional sales",
    description:
      "Revenue rose 3.8%, but the margin given away exceeded the extra revenue.",
    impact: 3200,
    confidence: 81,
    risk: "LOW",
    recommendedAction: "Reduce discount exposure for low-response customers",
    status: "NEW",
    category: "Discount leakage",
    detectedAt: "2026-09-24T11:20:00+05:30",
    evidence: [
      { label: "Offer", value: "10% off · ₹1,000+ bills" },
      { label: "Margin leakage", value: "₹3,200 this month" },
      { label: "Volume lift", value: "+3.8% · below break-even" },
    ],
    why: [
      "312 customers used the offer this month.",
      "Extra revenue (+₹700) did not cover the margin cost (−₹1,200).",
      "Low-response customers generated 80% of the margin loss.",
    ],
    actionPreview:
      "Restrict the 10% offer to your 40 most price-responsive customers and review again in 14 days.",
  },
  {
    id: "opp_004",
    type: "GROW",
    title: "Increase stock before demand spike",
    description:
      "Friday–Saturday demand has outgrown current shelf stock twice this month.",
    impact: 8000,
    confidence: 82,
    risk: "LOW",
    recommendedAction: "Raise weekend stock order by 20%",
    status: "NEW",
    category: "Demand capture",
    detectedAt: "2026-09-24T18:30:00+05:30",
    evidence: [
      { label: "Peak window", value: "Friday–Saturday" },
      { label: "Stock-outs", value: "2 weekends running" },
      { label: "Missed baskets", value: "≈22" },
    ],
    why: [
      "Friday revenue runs 24% above average — your highest window all month.",
      "At least 22 baskets went unbought when items ran out.",
      "Each missed basket averages ₹310.",
    ],
    actionPreview:
      "Order 20% extra stock of the 12 fastest-moving Friday–Saturday items before Thursday evening.",
  },
  {
    id: "opp_005",
    type: "GROW",
    title: "Bundle high-frequency products",
    description:
      "Saree buyers frequently add stitching separately. Bundling raises order value.",
    impact: 5500,
    confidence: 76,
    risk: "LOW",
    recommendedAction: "Run a 14-day bundle experiment",
    status: "NEW",
    category: "Bundle experiment",
    detectedAt: "2026-09-23T16:05:00+05:30",
    evidence: [
      { label: "Attach behavior", value: "68% buy stitching separately" },
      { label: "Current avg order", value: "₹1,850" },
      { label: "Bundle price", value: "₹30 stitching add-on" },
    ],
    why: [
      "Most saree buyers pay for stitching as a separate stop.",
      "A small bundle price matches what nearby stores successfully sell.",
      "Even a 15% attach rate adds ≈₹200/day.",
    ],
    actionPreview:
      "Set up a 14-day saree + stitching bundle experiment. HISAAB tracks order value daily vs your current average.",
  },
  {
    id: "opp_006",
    type: "GROW",
    title: "Open an additional service slot",
    description:
      "8–9 AM walk-ins are being missed before your counter opens.",
    impact: 5200,
    confidence: 69,
    risk: "MEDIUM",
    recommendedAction: "Pilot an 8 AM express counter for 2 weeks",
    status: "NEW",
    category: "New service slot",
    detectedAt: "2026-09-22T09:15:00+05:30",
    evidence: [
      { label: "Missed walk-ins", value: "≈18 per week" },
      { label: "Avg basket", value: "₹140" },
      { label: "Competing stores", value: "2 open by 7:30 AM" },
    ],
    why: [
      "18 people a week knock before opening time.",
      "Both stores nearby capture them today.",
      "A 2-week pilot costs you nothing but an hour of staff time.",
    ],
    actionPreview:
      "Add an 8–9 AM express counter for 14 days. HISAAB measures incremental revenue vs added cost.",
  },
];
