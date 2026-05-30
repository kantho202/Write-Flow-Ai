"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserX, UserCheck, Shield } from "lucide-react";
import { format } from "date-fns";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), ...(search && { search }) });
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateUser = async (id: string, data: any) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchUsers();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all platform users.</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase hidden sm:table-cell">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase hidden md:table-cell">Plan</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase hidden lg:table-cell">Joined</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{user.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{user.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.role === "ADMIN" ? "warning" : "secondary"} className="text-xs">{user.role}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{user.plan}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-slate-500">{format(new Date(user.createdAt), "MMM d, yyyy")}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.banned ? "destructive" : "success"} className="text-xs">
                          {user.banned ? "Banned" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => updateUser(user.id, { role: user.role === "ADMIN" ? "USER" : "ADMIN" })}
                          >
                            <Shield className="h-3 w-3" />
                            {user.role === "ADMIN" ? "Demote" : "Promote"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 text-xs ${user.banned ? "text-green-600" : "text-red-600"}`}
                            onClick={() => updateUser(user.id, { banned: !user.banned })}
                          >
                            {user.banned ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                            {user.banned ? "Unban" : "Ban"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
