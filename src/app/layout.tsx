import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { CopilotProvider } from "@/features/copilot/copilot-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HISAAB — Merchant Intelligence",
  description:
    "HISAAB protects your revenue, grows what's left, and proves what worked — powered by your Paytm data.",
};

export const viewport: Viewport = {
  themeColor: "#00BAF2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <CopilotProvider>
          <AppShell>{children}</AppShell>
        </CopilotProvider>
      </body>
    </html>
  );
}
