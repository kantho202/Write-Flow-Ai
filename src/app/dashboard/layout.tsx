"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/theme-provider";
import {
  FileText, User, BarChart2, LogOut, PenLine, Moon, Sun,
  Zap, Settings, Menu, X
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart2 },
  { href: "/dashboard/documents", label: "My Documents", icon: FileText },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
  { href: "/dashboard/ai-history", label: "AI Usage History", icon: Zap },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <Link href="/" className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
              <PenLine className="h-5 w-5" />
              WriteFlow AI
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{session?.user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <PenLine className="h-4 w-4" /> WriteFlow AI
          </Link>
          <div className="w-5" />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
