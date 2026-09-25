"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, Bell, CheckCheck } from "lucide-react";
import { cn, relativeTime } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { getNotifications, getPaytmConnection } from "@/lib/api/client";
import { usePageData } from "@/hooks/use-page-data";
import { Logo, MobileSidebar } from "./sidebar";
import type { Notification } from "@/types";

const TITLES: Record<string, [string, string]> = {
  "/": ["Overview", "Home · Rajesh Textiles"],
  "/protect": ["Protect", "Find leakage before it becomes permanent"],
  "/grow": ["Grow", "Grow what you have"],
  "/cash-flow": ["Cash Flow", "Where your money is going"],
  "/transactions": ["Transactions", "Payments · last 30 days"],
  "/customers": ["Customers", "Who visits, who's drifting"],
  "/experiments": ["Experiments", "Test what actually works"],
  "/actions": ["Actions", "Approvals · running · done"],
  "/impact": ["Impact", "What HISAAB has done for your business"],
  "/ai-copilot": ["AI Copilot", "Ask anything about your business"],
  "/settings": ["Settings", "Memory, automation & connections"],
  "/help": ["Help", "Answers and shortcuts"],
  "/system": ["System view", "How HISAAB works"],
};

const KIND_DOT: Record<Notification["kind"], string> = {
  OPPORTUNITY: "bg-paytm",
  ACTION: "bg-warn",
  OUTCOME: "bg-success",
  FORECAST: "bg-paytm-secondary",
  EXPERIMENT: "bg-success",
};

function pageMeta(pathname: string): [string, string] {
  if (TITLES[pathname]) return TITLES[pathname];
  const match = Object.keys(TITLES)
    .filter((path) => path !== "/" && pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0];
  return match ? TITLES[match] : ["HISAAB", "Merchant Intelligence"];
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const readIds = useAppStore((s) => s.readNotifications);
  const markRead = useAppStore((s) => s.markNotificationRead);
  const markAll = useAppStore((s) => s.markAllNotificationsRead);
  const { data: notifs } = usePageData(getNotifications, []);
  const { data: connection } = usePageData(getPaytmConnection, []);

  const [title, subtitle] = pageMeta(pathname);
  const unread = (notifs ?? []).filter(
    (notification) => !readIds.includes(notification.id) && !readIds.includes("__all__")
  ).length;

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        router.push("/ai-copilot");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
        <button
          className="rounded-xl p-2 text-inksoft hover:bg-lightblue lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden />
        </button>

        <Logo className="lg:hidden" />

        <div className="hidden min-w-0 lg:block">
          <h1 className="truncate text-base font-bold leading-tight text-ink">{title}</h1>
          <p className="truncate text-xs text-inksoft">{subtitle}</p>
        </div>

        <div className="ml-2 hidden items-center gap-1.5 xl:flex">
          <span className="rounded-full bg-successsoft px-2.5 py-1 text-2xs font-bold text-success">
            ● Paytm Connected
          </span>
          {connection && (
            <span className="text-2xs font-medium text-muted">sync {relativeTime(connection.lastSyncAt)}</span>
          )}
        </div>

        <Link
          href="/ai-copilot"
          className={cn(
            "ml-auto flex h-10 min-w-0 items-center gap-2.5 rounded-full border border-line bg-white px-4 text-sm text-inksoft",
            "transition-all hover:border-paytm/50 hover:shadow-sm sm:w-64 md:w-80"
          )}
          aria-label="Ask HISAAB"
        >
          <Search className="size-4 shrink-0 text-paytm-secondary" aria-hidden />
          <span className="truncate">Search or ask HISAAB…</span>
          <kbd className="ml-auto hidden rounded-md border border-line bg-lighterblue px-1.5 py-0.5 text-2xs font-semibold text-inksoft sm:block">
            ⌘K
          </kbd>
        </Link>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((value) => !value)}
            className="relative rounded-full p-2 text-inksoft transition hover:bg-lightblue hover:text-paytm-deep"
            aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
            aria-expanded={notifOpen}
          >
            <Bell className="size-5" aria-hidden />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex size-2.5 items-center justify-center rounded-full bg-paytm ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div
                className="absolute right-0 z-50 mt-2 w-[360px] max-w-[92vw] overflow-hidden rounded-2xl border border-line bg-white shadow-pop"
                role="menu"
                aria-label="Notifications"
              >
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-sm font-bold text-ink">Notifications</p>
                  <button
                    className="flex items-center gap-1 text-2xs font-semibold text-paytm-secondary hover:text-paytm-deep"
                    onClick={markAll}
                  >
                    <CheckCheck className="size-3.5" aria-hidden /> Mark all read
                  </button>
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                  {(notifs ?? []).map((notification) => {
                    const isRead =
                      readIds.includes(notification.id) || readIds.includes("__all__");
                    return (
                      <button
                        key={notification.id}
                        onClick={() => {
                          markRead(notification.id);
                          setNotifOpen(false);
                          router.push(notification.href ?? "/");
                        }}
                        className={cn(
                          "flex w-full gap-3 border-b border-line/70 px-4 py-3 text-left transition hover:bg-lighterblue",
                          !isRead && "bg-lighterblue"
                        )}
                        role="menuitem"
                      >
                        <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", KIND_DOT[notification.kind])} aria-hidden />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-ink">{notification.message}</span>
                          <span className="block text-xs text-inksoft">{notification.detail}</span>
                          <span className="mt-0.5 block text-2xs text-muted">{relativeTime(notification.at)}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1 pl-1 pr-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-paytm-deep text-xs font-bold text-white">
            RK
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-xs font-bold text-ink">Rajesh Kumar</span>
            <span className="block text-2xs text-inksoft">Rajesh Textiles</span>
          </span>
        </div>
      </div>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
