"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, RotateCcw, Sparkles, X } from "lucide-react";
import { askCopilot, type CopilotAnswer } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "hisaab";
  text: string;
  bullets?: string[];
  cta?: CopilotAnswer["cta"];
}

const SUGGESTIONS = [
  "Why did my revenue fall this week?",
  "Where am I losing money?",
  "How much can I safely spend?",
  "Which customers should I win back?",
  "What worked this month?",
  "What should I do today?",
];

export function CopilotChat({
  className,
  onClose,
  embedded = false,
}: {
  className?: string;
  onClose?: () => void;
  embedded?: boolean;
}) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [followUps, setFollowUps] = React.useState(SUGGESTIONS.slice(0, 4));
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const ask = React.useCallback(
    async (question: string) => {
      if (!question.trim() || busy) return;
      setMessages((current) => [...current, { role: "user", text: question }]);
      setInput("");
      setBusy(true);
      try {
        const answer = await askCopilot(question);
        setMessages((current) => [
          ...current,
          { role: "hisaab", text: answer.text, bullets: answer.bullets, cta: answer.cta },
        ]);
        setFollowUps(answer.followUps ?? []);
      } finally {
        setBusy(false);
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ top: 1e6, behavior: "smooth" });
        });
      }
    },
    [busy]
  );

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden border border-line bg-white shadow-pop",
        embedded ? "h-[min(720px,calc(100vh-13rem))] min-h-[480px] rounded-2xl" : "fixed inset-x-3 bottom-20 top-16 rounded-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto sm:h-[640px] sm:w-[420px]",
        className
      )}
      role={embedded ? "region" : "dialog"}
      aria-label="Ask HISAAB"
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-paytm-deep to-paytm-secondary px-5 py-4 text-white">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
          <Bot className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight">Ask HISAAB</p>
          <p className="text-2xs text-lightblue">Your business, explained.</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => {
              setMessages([]);
              setFollowUps(SUGGESTIONS.slice(0, 4));
            }}
            className="rounded-full p-2 text-lightblue hover:bg-white/10 hover:text-white"
            aria-label="Reset chat"
          >
            <RotateCcw className="size-4" aria-hidden />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-2 text-lightblue hover:bg-white/10 hover:text-white"
              aria-label="Close copilot"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-lighterblue/50 px-4 py-4">
        {messages.length === 0 && (
          <div className="pt-4 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-card">
              <Sparkles className="size-5 text-paytm-secondary" aria-hidden />
            </span>
            <p className="mt-3 text-base font-bold text-ink">Your business, in plain language.</p>
            <p className="mx-auto mt-1 max-w-[280px] text-sm text-inksoft">
              Ask anything — HISAAB answers with what, why, how much, and what next.
            </p>
          </div>
        )}

        {messages.map((message, index) =>
          message.role === "user" ? (
            <div key={`${message.text}-${index}`} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-paytm-deep px-3.5 py-2.5 text-sm text-white">
                {message.text}
              </div>
            </div>
          ) : (
            <motion.div
              key={`${message.text}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[92%]"
            >
              <div className="rounded-2xl rounded-bl-md border border-line bg-white px-3.5 py-3 text-sm shadow-card">
                <p className="font-medium text-ink">{message.text}</p>
                {message.bullets && (
                  <ul className="mt-2 space-y-1.5">
                    {message.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 text-inksoft">
                        <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-paytm" aria-hidden />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {message.cta && (
                  <Link
                    href={message.cta.href}
                    onClick={onClose}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-paytm px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#00a9dc]"
                  >
                    {message.cta.label}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                )}
              </div>
            </motion.div>
          )
        )}

        {busy && (
          <div className="flex items-center gap-2 text-xs text-inksoft" role="status">
            <span className="flex gap-1" aria-hidden>
              <span className="size-1.5 animate-pulseSoft rounded-full bg-paytm" />
              <span className="size-1.5 animate-pulseSoft rounded-full bg-paytm [animation-delay:0.3s]" />
              <span className="size-1.5 animate-pulseSoft rounded-full bg-paytm [animation-delay:0.6s]" />
            </span>
            HISAAB is checking your numbers…
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto border-t border-line bg-white px-4 py-2.5 [scrollbar-width:none]">
        {followUps.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => ask(suggestion)}
            className="whitespace-nowrap rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-inksoft transition hover:border-paytm/50 hover:text-paytm-deep"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void ask(input);
        }}
        className="flex items-center gap-2 border-t border-line bg-white px-3 py-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask anything about your business…"
          aria-label="Ask HISAAB"
          className="h-10 min-w-0 flex-1 rounded-full border border-line bg-lighterblue px-4 text-sm outline-none transition focus:border-paytm/60 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!input.trim() || busy}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-paytm text-white transition hover:bg-[#00a9dc] disabled:opacity-40"
          aria-label="Send"
        >
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </form>
    </div>
  );
}
