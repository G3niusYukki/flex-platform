'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, getUserStatusText, getUserStatusColor } from '@/lib/utils';

const userTypeText: Record<string, string> = { WORKER: '工人', EMPLOYER: '雇主' };

export default function UsersPage() {
  const [users, setUsers] = useState<Array<{
    id: string, phone: string, email: string | null, realName: string | null, userType: string, status: string, createdAt: string
  }>>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState('');
  const [status, setStatus] = useState('');

  const fetchUsers = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(pagination.limit) });
    if (search) params.set('search', search);
    if (userType) params.set('userType', userType);
    if (status) params.set('status', status);
    fetch(`/api/users?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(pagination.page); }, [pagination.page, search, userType, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">用户管理</h1>
        <p className="text-muted-foreground">查看和管理平台用户</p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setPagination((p) => ({ ...p, page: 1 })); fetchUsers(1); }} className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索手机号/姓名/邮箱"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-64 rounded-lg border bg-background pl-9 pr-4 text-sm"
          />
        </div>
        <select value={userType} onChange={(e) => setUserType(e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm">
          <option value="">全部类型</option>
          <option value="WORKER">工人</option>
          <option value="EMPLOYER">雇主</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm">
          <option value="">全部状态</option>
          <option value="PENDING">待审核</option>
          <option value="ACTIVE">正常</option>
          <option value="INACTIVE">已禁用</option>
          <option value="SUSPENDED">已封禁</option>
        </select>
        <button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">搜索</button>
      </form>
      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">手机号</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">姓名</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">类型</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">注册时间</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{user.phone}</td>
                    <td className="px-4 py-3">{user.realName || '-'}</td>
                    <td className="px-4 py-3">{userTypeText[user.userType] || user.userType}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getUserStatusColor(user.status)}`}>
                        {getUserStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && users.length === 0 && (
          <div className="flex h-48 items-center justify-center text-muted-foreground">暂无用户数据</div>
        )}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">共 {pagination.total} 条，第 {pagination.page} / {pagination.totalPages} 页</p>
            <div className="flex gap-2">
              <button onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={pagination.page <= 1} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))} disabled={pagination.page >= pagination.totalPages} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent disabled:opacity-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
