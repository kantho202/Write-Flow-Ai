"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, CheckCircle, X, Sparkles } from "lucide-react";
import { format } from "date-fns";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<any>(null);
  const [summarising, setSummarising] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/reviews?page=${page}`);
    const data = await res.json();
    setReviews(data.reviews || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const updateReview = async (id: string, approved: boolean) => {
    await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    fetchReviews();
  };

  const summariseReviews = async () => {
    setSummarising(true);
    const res = await fetch("/api/ai/summarise-reviews", { method: "POST" });
    const data = await res.json();
    setSummary(data);
    setSummarising(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Reviews</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Approve, reject, and analyse user reviews.</p>
        </div>
        <Button onClick={summariseReviews} disabled={summarising} variant="outline">
          <Sparkles className="h-4 w-4" /> {summarising ? "Summarising..." : "AI Summarise Reviews"}
        </Button>
      </div>

      {/* AI Summary */}
      {summary && (
        <Card className="mb-6 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> AI Review Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Key Themes</p>
                <ul className="space-y-1">
                  {summary.bullets?.map((b: string, i: number) => (
                    <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sentiment</p>
                <div className="space-y-1">
                  {summary.sentiment && Object.entries(summary.sentiment).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs capitalize text-slate-600 dark:text-slate-400 w-16">{key}</span>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${key === "positive" ? "bg-green-500" : key === "negative" ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${val}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{val as number}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />)}</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No reviews yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{r.user?.name || "User"}</span>
                        <span className="text-xs text-slate-400">{r.user?.email}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <Badge variant={r.approved ? "success" : "warning"} className="text-xs">{r.approved ? "Approved" : "Pending"}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{r.content}</p>
                      <p className="text-xs text-slate-400">Template: {r.template?.title} · {format(new Date(r.createdAt), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!r.approved && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" onClick={() => updateReview(r.id, true)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteReview(r.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
