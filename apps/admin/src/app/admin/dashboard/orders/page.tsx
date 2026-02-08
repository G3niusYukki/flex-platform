'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, getOrderStatusText, getOrderStatusColor } from '@/lib/utils';

const dispatchStatusText: Record<string, string> = {
  UNASSIGNED: '未派单', PENDING_ACCEPT: '待接受', ASSIGNED: '已派单', REJECTED: '被拒绝', TIMEOUT: '超时',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Array<{
    id: string, orderNo: string, title: string, status: string, dispatchStatus: string, scheduledStart: string,
    employer: { phone: string, realName: string | null }, worker: { phone: string, realName: string | null } | null
  }>>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState('');

  const fetchOrders = (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(pagination.limit) });
    if (status) params.set('status', status);
    if (dispatchStatus) params.set('dispatchStatus', dispatchStatus);
    fetch(`/api/orders?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
        setPagination(data.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(pagination.page); }, [pagination.page, status, dispatchStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">订单管理</h1>
        <p className="text-muted-foreground">查看和管理平台订单</p>
      </div>
      <div className="flex gap-2">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm">
          <option value="">全部订单状态</option>
          <option value="PENDING">待接单</option>
          <option value="ACCEPTED">已接单</option>
          <option value="IN_PROGRESS">进行中</option>
          <option value="COMPLETED">已完成</option>
          <option value="CANCELED">已取消</option>
          <option value="DISPUTED">有争议</option>
        </select>
        <select value={dispatchStatus} onChange={(e) => setDispatchStatus(e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm">
          <option value="">全部派单状态</option>
          <option value="UNASSIGNED">未派单</option>
          <option value="PENDING_ACCEPT">待接受</option>
          <option value="ASSIGNED">已派单</option>
          <option value="REJECTED">被拒绝</option>
          <option value="TIMEOUT">超时</option>
        </select>
      </div>
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
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">订单号</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">标题</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">雇主</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">工人</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">订单状态</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">派单状态</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">计划开始</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-xs">{order.orderNo}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{order.title}</td>
                    <td className="px-4 py-3">{order.employer?.realName || order.employer?.phone || '-'}</td>
                    <td className="px-4 py-3">{order.worker?.realName || order.worker?.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{dispatchStatusText[order.dispatchStatus] || order.dispatchStatus}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(order.scheduledStart)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && orders.length === 0 && (
          <div className="flex h-48 items-center justify-center text-muted-foreground">暂无订单数据</div>
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
