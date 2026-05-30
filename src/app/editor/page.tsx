"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PenLine, Zap, MessageSquare, RefreshCw, Save, ArrowLeft, Send, X, Wand2 } from "lucide-react";

interface ChatMessage { role: "user" | "assistant"; content: string; }

function EditorContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const docId = searchParams.get("doc");
  const templateId = searchParams.get("template");

  const [title, setTitle] = useState("Untitled Document");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("");
  const [contentType, setContentType] = useState("blog post");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentDocId, setCurrentDocId] = useState<string | null>(docId);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [rewriteMode, setRewriteMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [rewriteTone, setRewriteTone] = useState("formal");
  const [rewriting, setRewriting] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (docId) {
      fetch(`/api/documents/${docId}`).then((r) => r.json()).then((d) => {
        if (!d.error) { setTitle(d.title); setContent(d.content); setCurrentDocId(d.id); }
      });
    }
  }, [docId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const generateContent = async () => {
    if (!topic) { setError("Please enter a topic first."); return; }
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, audience, contentType }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setTitle(data.title || title);
      setContent(data.content || "");
    } catch {
      setError("Generation failed. Please check your API key and try again.");
    } finally {
      setGenerating(false);
    }
  };

  const saveDocument = async () => {
    setSaving(true);
    const method = currentDocId ? "PATCH" : "POST";
    const url = currentDocId ? `/api/documents/${currentDocId}` : "/api/documents";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, templateId }),
    });
    const data = await res.json();
    if (!currentDocId && data.id) setCurrentDocId(data.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRewrite = async () => {
    if (!selectedText) { setError("Select some text to rewrite."); return; }
    setRewriting(true);
    const res = await fetch("/api/ai/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText, tone: rewriteTone }),
    });
    const data = await res.json();
    if (data.rewritten) {
      setContent((c) => c.replace(selectedText, data.rewritten));
      setSelectedText("");
      setRewriteMode(false);
    }
    setRewriting(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput };
    setChatMessages((m) => [...m, userMsg]);
    setChatInput("");
    setChatLoading(true);
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...chatMessages, userMsg],
        documentContext: content.substring(0, 500),
      }),
    });
    const data = await res.json();
    if (data.reply) {
      setChatMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    }
    setChatLoading(false);
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <PenLine className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-0 bg-transparent text-base font-semibold focus:ring-0 p-0 h-auto max-w-xs"
          placeholder="Document title..."
        />
        <div className="ml-auto flex items-center gap-2">
          {saved && <Badge variant="success" className="text-xs">Saved</Badge>}
          <Button variant="outline" size="sm" onClick={() => setRewriteMode(!rewriteMode)}>
            <Wand2 className="h-4 w-4" /> Rewrite
          </Button>
          <Button variant="outline" size="sm" onClick={() => setChatOpen(!chatOpen)}>
            <MessageSquare className="h-4 w-4" /> AI Chat
          </Button>
          <Button size="sm" onClick={saveDocument} disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - AI controls */}
        <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 overflow-y-auto hidden lg:block">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Content Draft Agent
          </h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="mt-1 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog post">Blog Post</SelectItem>
                  <SelectItem value="social media caption">Social Caption</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="ad copy">Ad Copy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Topic *</Label>
              <Textarea
                placeholder="e.g. 10 productivity tips for remote workers"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 text-sm"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="mt-1 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Target Audience</Label>
              <Input
                placeholder="e.g. Marketing professionals"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="mt-1 h-9 text-sm"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button className="w-full" onClick={generateContent} disabled={generating}>
              {generating ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Zap className="h-4 w-4" /> Generate</>
              )}
            </Button>
          </div>

          {/* Rewrite panel */}
          {rewriteMode && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
                <Wand2 className="h-4 w-4 text-amber-500" /> Rewrite & Tone Agent
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Selected Text</Label>
                  <Textarea
                    placeholder="Select text in the editor, or paste here..."
                    value={selectedText}
                    onChange={(e) => setSelectedText(e.target.value)}
                    className="mt-1 text-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-xs">Rewrite As</Label>
                  <Select value={rewriteTone} onValueChange={setRewriteTone}>
                    <SelectTrigger className="mt-1 h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="shorten">Shorten</SelectItem>
                      <SelectItem value="expand">Expand</SelectItem>
                      <SelectItem value="grammar">Fix Grammar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" size="sm" onClick={handleRewrite} disabled={rewriting}>
                  {rewriting ? "Rewriting..." : "Rewrite"}
                </Button>
              </div>
            </div>
          )}
        </aside>

        {/* Editor */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onMouseUp={() => {
              const sel = window.getSelection()?.toString();
              if (sel) setSelectedText(sel);
            }}
            placeholder="Start writing, or use the AI Draft Agent on the left to generate content..."
            className="w-full min-h-[calc(100vh-200px)] text-base leading-relaxed resize-none border-0 bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6 focus:ring-1 focus:ring-indigo-500"
          />
        </main>

        {/* Chat sidebar */}
        {chatOpen && (
          <aside className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> AI Chat Assistant
              </h3>
              <button onClick={() => setChatOpen(false)}>
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ask me anything about your content. I understand your current document.</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your content..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                  className="text-sm"
                />
                <Button size="icon" onClick={sendChat} disabled={chatLoading || !chatInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
