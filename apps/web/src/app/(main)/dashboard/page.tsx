'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, getOrderStatusText, getOrderStatusColor } from '@/lib/utils';

type Order = { id: string, orderNo: string, title: string, status: string, scheduledStart: string, expectedSalary: unknown };

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login?callbackUrl=/dashboard');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/orders?limit=20')
      .then((res) => res.json())
      .then((data) => { if (data.success && data.data?.data) setOrders(data.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  if (status === 'loading' || status === 'unauthenticated' || loading) {
    return <div className="container py-12 flex items-center justify-center min-h-[400px]"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">个人中心</h1><p className="text-muted-foreground mt-1">欢迎回来，{session?.user?.name || '用户'}</p></div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link href="/profile" className="flex items-center gap-2"><User className="h-4 w-4" />个人资料</Link></Button>
          <Button asChild><Link href="/jobs" className="flex items-center gap-2"><Plus className="h-4 w-4" />发布/浏览职位</Link></Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />我的订单</CardTitle><p className="text-sm text-muted-foreground">查看您参与或发布的订单</p></CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
                <Package className="mx-auto h-12 w-12 opacity-50" /><p className="mt-2">暂无订单</p>
                <Button variant="outline" size="sm" className="mt-4" asChild><Link href="/jobs">去浏览职位</Link></Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <Link key={order.id} href={`/jobs/${order.id}`} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    <div><p className="font-medium line-clamp-1">{order.title}</p><p className="text-sm text-muted-foreground">{formatDate(order.scheduledStart)}</p></div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getOrderStatusColor(order.status)}`}>{getOrderStatusText(order.status)}</span>
                  </Link>
                ))}
                {orders.length > 5 && <Button variant="ghost" size="sm" className="w-full" asChild><Link href="/jobs">查看全部</Link></Button>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />快捷操作</CardTitle><p className="text-sm text-muted-foreground">常用功能入口</p></CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild><Link href="/jobs">浏览职位</Link></Button>
            <Button variant="outline" className="w-full justify-start" asChild><Link href="/profile">编辑个人资料</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
