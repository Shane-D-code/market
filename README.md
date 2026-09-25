# HISAAB

An AI-powered business intelligence and action platform for small & medium Indian
merchants. HISAAB continuously answers two questions:

- **PROTECT** — Where am I losing money?
- **GROW** — What can I do with the money I have left?

It turns transaction data into a loop: **DETECT → EXPLAIN → DECIDE → ACT → PROVE → LEARN**.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build` / `npm run start` for production, `npm run typecheck` for types.

## Routes

| Route | Purpose |
|---|---|
| `/` | Overview — Today's Hisaab: 4 numbers + 3 actions |
| `/protect` | Revenue leakage: where money is draining, with recommended actions |
| `/grow` | Projected leftover, cash-flow timeline, growth opportunities |
| `/transactions` | Searchable transaction table with detail drawer |
| `/customers` | Win-back intelligence + return-interval distribution |
| `/experiments` | A/B experiments with verdicts — HISAAB visibly learns |
| `/actions` | Approval queue, running, completed, rejected |
| `/cash-flow` | Money in/out, commitments, natural-language leftover |
| `/impact` | Proof: recovered rupees + insight→action→outcome timelines |
| `/settings` | Business memory, learned facts, automation mode (Assist/Approve/Autopilot) |
| `/system` | Hidden technical architecture view for demo/judges |

## Architecture

```
src/
  types/            # domain models (Opportunity, Action, Experiment, ...)
  lib/api/          # service layer — swap bodies for FastAPI calls, UI unchanged
  lib/mock-data/    # realistic, internally consistent merchant dataset
  components/ui/    # shadcn-style primitives (button, card, drawer, tabs, ...)
  components/layout/# sidebar, top bar, mobile nav
  features/         # copilot, opportunity cards/drawer, insight cards
  store/            # zustand (approvals, notifications, copilot)
  hooks/            # data-fetch hook with loading/error states
```

All numbers reconcile: ₹5,00,000 revenue − ₹3,55,000 expenditure − ₹1,20,000
commitments → ₹25,000 leftover. Leakage ₹18,400 = churn 11,500 + failed 2,100 +
discounts 3,200 + refunds 950 + other 650.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind · Radix primitives ·
Recharts · Framer Motion · Zustand · Lucide
# market
