import Link from "next/link";
import { PenLine, X, Link2, GitBranch, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400 mb-3">
              <PenLine className="h-6 w-6" />
              WriteFlow AI
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              The AI-powered content workspace for modern teams. Plan, generate, review, and publish content faster than ever.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors" aria-label="Twitter">
                <X className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors" aria-label="LinkedIn">
                <Link2 className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors" aria-label="GitHub">
                <GitBranch className="h-4 w-4" />
              </a>
              <a href="mailto:hello@writeflow.ai" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Product</h3>
            <ul className="space-y-2">
              {[
                { href: "/explore", label: "Explore Templates" },
                { href: "/#features", label: "Features" },
                { href: "/#pricing", label: "Pricing" },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Company</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms & Conditions" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} WriteFlow AI. All rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built with Next.js 14 + AI
          </p>
        </div>
      </div>
    </footer>
  );
}
