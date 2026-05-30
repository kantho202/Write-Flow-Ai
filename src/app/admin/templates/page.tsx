"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, X, CheckCircle } from "lucide-react";

interface TemplateForm {
  title: string; category: string; description: string;
  prompt: string; sampleOutput: string; tone: string; wordCount: string; aiModel: string;
}

const emptyForm: TemplateForm = { title: "", category: "BLOG", description: "", prompt: "", sampleOutput: "", tone: "Professional", wordCount: "", aiModel: "gpt-4o" };

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/templates?page=1");
    const data = await res.json();
    setTemplates(data.templates || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const openEdit = (t: any) => {
    setEditId(t.id);
    setForm({ title: t.title, category: t.category, description: t.description, prompt: t.prompt, sampleOutput: t.sampleOutput || "", tone: t.tone || "Professional", wordCount: String(t.wordCount || ""), aiModel: t.aiModel || "gpt-4o" });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const method = editId ? "PATCH" : "POST";
    const url = editId ? `/api/templates/${editId}` : "/api/templates";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, wordCount: form.wordCount ? parseInt(form.wordCount) : null }),
    });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setShowForm(false); setEditId(null); setForm(emptyForm); fetchTemplates(); }, 1500);
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
    fetchTemplates();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Templates</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Create, edit, and delete AI templates.</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}>
          <Plus className="h-4 w-4" /> New Template
        </Button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{editId ? "Edit Template" : "New Template"}</h2>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BLOG">Blog</SelectItem>
                      <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="AD_COPY">Ad Copy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={2} />
              </div>
              <div>
                <Label>Prompt</Label>
                <Textarea value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} className="mt-1" rows={3} placeholder="Use {topic}, {tone}, {audience} as variables" />
              </div>
              <div>
                <Label>Sample Output</Label>
                <Textarea value={form.sampleOutput} onChange={(e) => setForm({ ...form, sampleOutput: e.target.value })} className="mt-1" rows={3} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Tone</Label>
                  <Input value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>Word Count</Label>
                  <Input type="number" value={form.wordCount} onChange={(e) => setForm({ ...form, wordCount: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label>AI Model</Label>
                  <Input value={form.aiModel} onChange={(e) => setForm({ ...form, aiModel: e.target.value })} className="mt-1" />
                </div>
              </div>
              {success && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" /> Template saved!
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving || !form.title}>{saving ? "Saving..." : "Save Template"}</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />)}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Uses</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {templates.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{t.title}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs">{t.category.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-500">{t.usageCount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteTemplate(t.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
