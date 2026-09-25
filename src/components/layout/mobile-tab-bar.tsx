"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShieldAlert,
  Sprout,
  Zap,
  LayoutGrid,
  Waves,
  ArrowLeftRight,
  Users,
  FlaskConical,
  FileBarChart,
  Settings,
  CircleHelp,
  Bot,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/protect", label: "Protect", icon: ShieldAlert },
  { href: "/grow", label: "Grow", icon: Sprout },
  { href: "/actions", label: "Actions", icon: Zap },
] as const;

const MORE_LINKS = [
  { href: "/cash-flow", label: "Cash Flow", icon: Waves },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/experiments", label: "Experiments", icon: FlaskConical },
  { href: "/impact", label: "Impact", icon: FileBarChart },
  { href: "/ai-copilot", label: "AI Copilot", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: CircleHelp },
] as const;

function activePath(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);
  const moreActive = MORE_LINKS.some((link) => activePath(pathname, link.href));

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        aria-label="Mobile"
      >
        <div className="grid grid-cols-5">
          {TABS.map((tab) => {
            const active = activePath(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-2xs font-semibold transition-colors",
                  active ? "text-paytm-secondary" : "text-inksoft/70"
                )}
              >
                <tab.icon className="size-5" aria-hidden />
                {tab.label}
              </Link>
            );
          })}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 text-2xs font-semibold transition-colors",
              moreActive ? "text-paytm-secondary" : "text-inksoft/70"
            )}
            aria-expanded={moreOpen}
            aria-label="Open all sections"
          >
            <LayoutGrid className="size-5" aria-hidden />
            More
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-paytm-deep/50 backdrop-blur-[2px]" onClick={() => setMoreOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-line bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-pop">
            <div className="mx-auto mb-4 flex items-center justify-between">
              <p className="text-base font-bold text-ink">All sections</p>
              <button
                onClick={() => setMoreOpen(false)}
                className="rounded-full p-2 text-inksoft hover:bg-lightblue"
                aria-label="Close menu"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {MORE_LINKS.map((link) => {
                const active = activePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center text-2xs font-semibold transition",
                      active
                        ? "border-paytm/40 bg-lightblue text-paytm-deep"
                        : "border-line bg-white text-inksoft hover:bg-lighterblue"
                    )}
                  >
                    <link.icon className="size-5 text-paytm-secondary" aria-hidden />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
