'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency, formatDate, getOrderStatusText, getOrderStatusColor } from '@/lib/utils';

type Order = {
  id: string, orderNo: string, title: string, description: string, serviceCategory: string, address: string,
  city: string | null, scheduledStart: string, expectedSalary: unknown, status: string
};

export default function JobsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');

  const fetchOrders = (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: '12' });
    if (city) params.set('city', city);
    if (status) params.set('status', status);
    fetch(`/api/orders?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrders(data.data.data || []);
          setTotalPages(data.data.totalPages || 1);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchOrders(1); };

  return (
    <div className="container py-8">
      <div className="mb-8"><h1 className="text-2xl font-bold tracking-tight">职位列表</h1><p className="text-muted-foreground mt-1">浏览并申请心仪职位</p></div>
      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="城市" value={city} onChange={(e) => setCity(e.target.value)} className="h-10 w-full rounded-md border bg-background pl-9 pr-4 text-sm" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
          <option value="">全部状态</option>
          <option value="PENDING">待接单</option>
          <option value="ACCEPTED">已接单</option>
          <option value="IN_PROGRESS">进行中</option>
          <option value="COMPLETED">已完成</option>
        </select>
        <Button type="submit">搜索</Button>
      </form>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (<Card key={i} className="animate-pulse"><CardContent className="pt-6"><div className="h-5 w-3/4 rounded bg-muted" /><div className="mt-4 h-4 w-full rounded bg-muted" /><div className="mt-2 h-4 w-2/3 rounded bg-muted" /></CardContent></Card>))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold line-clamp-1">{order.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getOrderStatusColor(order.status)}`}>{getOrderStatusText(order.status)}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{order.serviceCategory}</p>
                <p className="text-sm line-clamp-2 text-muted-foreground mb-3">{order.description}</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><span className="truncate">{order.city || order.address}</span></div>
                  <div className="flex items-center gap-2"><span>{formatDate(order.scheduledStart)}</span></div>
                  <div className="flex items-center gap-2 font-medium text-primary"><span>{formatCurrency(Number(order.expectedSalary))}</span></div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild><Link href={`/jobs/${order.id}`}>查看详情</Link></Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="rounded-xl border border-dashed bg-muted/30 py-16 text-center"><p className="text-muted-foreground">暂无职位</p></div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>上一页</Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">第 {page} / {totalPages} 页</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>下一页</Button>
        </div>
      )}
    </div>
  );
}
