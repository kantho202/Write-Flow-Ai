"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Clock } from "lucide-react";
import { format } from "date-fns";

export default function AIHistoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), ...(agent !== "ALL" && { agent }) });
    const res = await fetch(`/api/user/ai-logs?${params}`);
    const data = await res.json();
    setLogs(data.logs || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  }, [page, agent]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const agentColors: Record<string, string> = {
    "Content Draft Agent": "default",
    "Rewrite & Tone Agent": "warning",
    "AI Content Chat Assistant": "success",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Usage History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track all your AI agent interactions.</p>
      </div>

      <div className="flex gap-3 mb-6">
        <Select value={agent} onValueChange={(v) => { setAgent(v); setPage(1); }}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Agents</SelectItem>
            <SelectItem value="Content Draft Agent">Content Draft Agent</SelectItem>
            <SelectItem value="Rewrite & Tone Agent">Rewrite & Tone Agent</SelectItem>
            <SelectItem value="AI Content Chat Assistant">Chat Assistant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <Zap className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No AI usage logs yet. Start using the AI agents!</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Agent</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase hidden md:table-cell">Prompt</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(log.createdAt), "MMM d, HH:mm")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={(agentColors[log.agentUsed] as any) || "default"} className="text-xs whitespace-nowrap">
                        {log.agentUsed}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[250px] block">{log.promptSnippet}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{log.tokensUsed.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
}
