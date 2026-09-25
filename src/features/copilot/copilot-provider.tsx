"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { CopilotChat } from "./copilot-chat";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const open = useAppStore((state) => state.copilotOpen);
  const setOpen = useAppStore((state) => state.setCopilotOpen);
  const onCopilotPage = pathname === "/ai-copilot";

  return (
    <>
      {children}
      <AnimatePresence>
        {open && !onCopilotPage && <CopilotChat key="copilot" onClose={() => setOpen(false)} />}
      </AnimatePresence>
      {!onCopilotPage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6"
        >
          <Link
            href="/ai-copilot"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-paytm-deep to-paytm-secondary py-2.5 pl-3 pr-4 text-sm font-bold text-white shadow-pop transition hover:opacity-95"
            aria-label="Ask HISAAB"
          >
            <Bot className="size-5" aria-hidden />
            Ask HISAAB
          </Link>
        </motion.div>
      )}
    </>
  );
}
