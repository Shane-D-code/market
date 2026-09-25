"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  Sprout,
  Waves,
  ArrowLeftRight,
  Users,
  FlaskConical,
  Zap,
  FileBarChart,
  Bot,
  Settings,
  CircleHelp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPaytmConnection } from "@/lib/api/client";
import { usePageData } from "@/hooks/use-page-data";
import { relativeTime } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/protect", label: "Protect", icon: ShieldAlert },
  { href: "/grow", label: "Grow", icon: Sprout },
  { href: "/cash-flow", label: "Cash Flow", icon: Waves },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/experiments", label: "Experiments", icon: FlaskConical },
  { href: "/actions", label: "Actions", icon: Zap },
  { href: "/impact", label: "Impact", icon: FileBarChart },
  { href: "/ai-copilot", label: "AI Copilot", icon: Bot },
] as const;

const SECONDARY = [
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-paytm to-paytm-deep shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5 text-white" aria-hidden>
          <path
            d="M4 17c2.5-1 4-3.5 4-6.5 0-2 1.5-3.5 3.5-3.5S15 8.5 15 10.5c0 3 1.5 5.5 4 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="12" cy="19" r="1.6" fill="currentColor" />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block text-lg font-extrabold tracking-tight text-paytm-deep">HISAAB</span>
        <span className="block text-2xs font-semibold text-inksoft">Merchant Intelligence</span>
      </span>
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { data: connection } = usePageData(getPaytmConnection, []);

  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto px-3 pb-4" aria-label="Main">
      <div className="px-2 pb-5 pt-6">
        <Logo />
      </div>

      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
              active
                ? "bg-lightblue font-semibold text-paytm-secondary"
                : "bg-transparent font-semibold text-inksoft hover:bg-lighterblue hover:text-paytm-deep"
            )}
          >
            {active && (
              <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-paytm" aria-hidden />
            )}
            <item.icon
              className={cn(
                "size-4 shrink-0",
                active ? "text-paytm-secondary" : "text-inksoft/70 group-hover:text-paytm-secondary"
              )}
              aria-hidden
            />
            {item.label}
            {item.href === "/ai-copilot" && (
              <span className="ml-auto rounded-md bg-paytm/10 px-1.5 py-0.5 text-2xs font-bold text-paytm-secondary">
                ⌘K
              </span>
            )}
          </Link>
        );
      })}

      <div className="my-3 border-t border-line" />

      {SECONDARY.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
              active
                ? "bg-lightblue font-semibold text-paytm-secondary"
                : "bg-transparent font-semibold text-inksoft hover:bg-lighterblue hover:text-paytm-deep"
            )}
          >
            {active && (
              <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-paytm" aria-hidden />
            )}
            <item.icon
              className={cn(
                "size-4 shrink-0",
                active ? "text-paytm-secondary" : "text-inksoft/70 group-hover:text-paytm-secondary"
              )}
              aria-hidden
            />
            {item.label}
          </Link>
        );
      })}

      <Link
        href="/help"
        onClick={onNavigate}
        className="group flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-inksoft transition-all hover:bg-lighterblue hover:text-paytm-deep"
      >
        <CircleHelp className="size-4 shrink-0 text-inksoft/70 group-hover:text-paytm-secondary" aria-hidden />
        Help
      </Link>

      <div className="mt-auto rounded-2xl border border-line bg-lighterblue p-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paytm-deep text-xs font-bold text-white">
            RK
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-bold text-ink">Rajesh Kumar</p>
            <p className="truncate text-2xs text-inksoft">Rajesh Textiles</p>
          </div>
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-2xs font-semibold text-success">
          <span className="relative flex size-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          Connected to Paytm
          {connection && <span className="font-medium text-muted">· sync {relativeTime(connection.lastSyncAt)}</span>}
        </p>
      </div>

      <Link
        href="/system"
        onClick={onNavigate}
        className="mt-2 px-3 text-2xs font-semibold text-muted transition hover:text-paytm-secondary"
      >
        Technical view (/system) →
      </Link>
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-line bg-white lg:block">
      <SidebarNav />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div
        className={cn(
          "absolute inset-0 bg-paytm-deep/50 backdrop-blur-[2px] transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-[272px] bg-white shadow-drawer transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-6 rounded-full p-2 text-inksoft hover:bg-lightblue"
          aria-label="Close menu"
        >
          <X className="size-4" aria-hidden />
        </button>
        <SidebarNav onNavigate={onClose} />
      </div>
    </div>
  );
}

export { Logo };
