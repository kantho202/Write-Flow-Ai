import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "WriteFlow AI — AI-Powered Content Workspace",
  description: "Plan, generate, review, and publish content with agentic AI. The modern content workspace for teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased">
        <SessionProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
