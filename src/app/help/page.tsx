import Link from "next/link";
import { ArrowRight, CircleHelp, MessageCircle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/features/shared/page-header";

const TOPICS = [
  {
    title: "How HISAAB reads my business",
    body: "HISAAB compares Paytm transactions, customer return patterns, commitments, and completed experiments to explain what changed.",
    href: "/system",
    icon: ShieldCheck,
  },
  {
    title: "What can I do today?",
    body: "Start with the overview for the three highest-value decisions, then open Actions to approve or reject them.",
    href: "/",
    icon: CircleHelp,
  },
  {
    title: "Ask a question",
    body: "The AI Copilot answers with the number, the reason, and a next step that links to the relevant workspace.",
    href: "/ai-copilot",
    icon: MessageCircle,
  },
];

export default function HelpPage() {
  return (
    <div>
      <PageHeader title="Help" subtitle="Short answers for getting the most from HISAAB." />
      <div className="grid gap-4 md:grid-cols-3">
        {TOPICS.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
          >
            <topic.icon className="size-5 text-paytm-secondary" aria-hidden />
            <h2 className="mt-4 text-lg font-bold text-ink">{topic.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-inksoft">{topic.body}</p>
            <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-bold text-paytm-secondary">
              Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
