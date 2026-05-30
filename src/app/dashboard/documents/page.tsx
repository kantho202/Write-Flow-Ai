"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Plus, Trash2, Edit, Clock } from "lucide-react";
import { format } from "date-fns";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), ...(status !== "ALL" && { status }), ...(search && { search }) });
    const res = await fetch(`/api/documents?${params}`);
    const data = await res.json();
    setDocuments(data.documents || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  }, [page, status, search]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const deleteDoc = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    fetchDocs();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Documents</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">All your drafts and published content.</p>
        </div>
        <Button asChild>
          <Link href="/editor"><Plus className="h-4 w-4" /> New Document</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">You have no documents yet. Start writing →</p>
          <Button className="mt-4" asChild>
            <Link href="/editor">Create Document</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Words</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px]">{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{doc.wordCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={doc.status === "PUBLISHED" ? "success" : doc.status === "ARCHIVED" ? "secondary" : "warning"} className="text-xs">
                      {doc.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(doc.updatedAt), "MMM d, yyyy")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link href={`/editor?doc=${doc.id}`}><Edit className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteDoc(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
